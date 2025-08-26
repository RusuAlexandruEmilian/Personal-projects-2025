const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');




router.get('/enable/disable', (req, res) => {

    const {two_factor_authentication, email, name} = req.query;

    const twoFactorStatus = two_factor_authentication === 'true'; 

    

    if(!twoFactorStatus){
        const secret = speakeasy.generateSecret({
        name: `Token for user: ${name}`
        });

        pool.query('UPDATE users SET two_factor_authentication = $1, two_factor_passcode = $2 WHERE email = $3', [true, secret.ascii, email], (err, result) =>{
            if(err){
                console.error('Error fetching data from database:', err);
                res.status(500).json({ error: 'Database query error' });
            }
        })

        qrcode.toDataURL(secret.otpauth_url, (err, data) =>{
        res.json(data);
        });
    }else{
       pool.query('UPDATE users SET two_factor_authentication = $1, two_factor_passcode = $2 WHERE email = $3', [false, '', email], (err, result) =>{
            if(err){
                console.error('Error fetching data from database:', err);
                res.status(500).json({ error: 'Database query error' });
            }

            
                res.json('Two factor authentication disabled!')
            
        })
       
    }
    

   
    
});




router.post('/login', (req, res) => {
    const { email, token } = req.body;

    pool.query('SELECT two_factor_passcode, id FROM users WHERE email = $1', [email], (err, details) => {
        if(err){
            console.error('Error fetching data from database:', err);
            res.status(500).json({ error: 'Database query error' });
        }

        if(details.rows[0].two_factor_passcode != null){
            const verified = speakeasy.totp.verify({
                secret: details.rows[0].two_factor_passcode,
                encoding: 'ascii',
                token: token,
            })
            if(verified){
                const userId = details.rows[0].id;
                    const token = jwt.sign({user_id: userId}, process.env.JWT_SECRET);
                        
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: 'none', 
                        secure: true
                    });

                    res.status(200).json("Token accepted")
            }else{
                res.status(401).json("Wrong token");
            }
        }else{
            res.json("There is no passcode!")
        }
    });

});




module.exports = router;