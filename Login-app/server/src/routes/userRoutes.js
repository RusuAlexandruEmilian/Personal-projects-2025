const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const rateLimit = require("express-rate-limit");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const limiter = rateLimit({
    windowMs: 10*1000,
    limit: 5,
    message: "Too many login attempts. Try again in 10 seconds"
});





router.post('/login', limiter, (req, res)=>{
    const {email, password} = req.body;

    pool.query("SELECT * FROM users WHERE email = $1", [email], (err, result)=>{
         if (err) {
          console.error('Error fetching data from database:', err);
          res.status(500).json({ error: 'Database query error' });
        }

        const{rows} = result;

        if(rows.length > 0){
            bcrypt.compare(password, rows[0].password, function(err, match) {
                if(err){
                    res.json(err);
                }

                if(match){
                    pool.query('SELECT two_factor_authentication FROM users WHERE email = $1', [email], (err, two_factor) => {
                      if(err){
                          console.error('Error fetching data from database:', err);
                          res.status(500).json({ error: 'Database query error' });
                      }
                      
                      const two_factor_authentication = two_factor.rows[0].two_factor_authentication;
                      
                      
                      if(!two_factor_authentication){
                          const userId = rows[0].id;
                          const token = jwt.sign({user_id: userId}, process.env.JWT_SECRET);
                          res.cookie("token", token, {
                              httpOnly: true,
                              sameSite: 'none', 
                              secure: true
                          });
                         
                          res.status(200).json({two_factor_authentication: false})
                      }else{
                          res.json({two_factor_authentication: true});
                      }
                    })
                    
                }else{
                    res.status(401).json("Wrong email or password !");
                }
            });

           
            
        }else{
            res.status(401).json("Wrong email or password !");
        }
       
    });
});

router.get('/details/db', (req, res) => {
    const {user_id} = req.query;

    pool.query('SELECT * FROM users WHERE id = $1', [user_id], (err, userDetails) =>{
            if(err){
                console.error('Error fetching data from database:', err);
                res.status(500).json({ error: 'Database query error' });
            }
            res.json(userDetails.rows[0]);
    })
})



router.get('/details', (req, res) => {
    const token = req.cookies.token;

    if(!token){
        res.status(200).json();
    }else{
        try{
        const userId = jwt.verify(token, process.env.JWT_SECRET);
        pool.query('SELECT name, surname, email, phone, two_factor_authentication FROM users WHERE id = $1', [userId.user_id], (err, userDetails) =>{
            if(err){
                console.error('Error fetching data from database:', err);
                res.status(500).json({ error: 'Database query error' });
            }

            const { rows } = userDetails;

            res.json(rows[0]);
        });
        }catch(err){
            res.status(401).json(err);
        }
    }
    
});


router.post('/signout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,       
    sameSite: 'none'
  }).json({ message: 'Successfully signed out' });
});



router.post('/register', (req, res) => {
    const {name, surname, email, password} = req.body;

    pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
        if(err){
            console.error('Error fetching data from database:', err);
            res.status(500).json({ error: 'Database query error' });
        }

        if(result.rows.length > 0){
            return res.status(409).json({
                error: "Email already exists",
                message: "The email address provided is already registered"
            });
        }else{
            bcrypt.hash(password, 10, (err, hash) => {
                if(err){
                    res.json(err);
                }

                pool.query('INSERT INTO users (name, surname, email, password, two_factor_authentication) VALUES ($1, $2, $3, $4, $5)', [name, surname, email, hash, false], (err, registered) => {
                    if(err){
                        console.error('Error inserting data into database:', err);
                        res.status(500).json({ error: 'Database query error' });
                    }
                
                    res.status(200).json({message: "Uer successfully created"})
                })
            })
        }

        
    });

    
})



module.exports = router;