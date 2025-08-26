const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
let cors = require('cors');
const postgres = require('postgres');
require('dotenv').config();

app.use(cors({preflightContinue: true}));

app.use(express.json());

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false } // required for Supabase
});


app.get('/', (req, res) => {
    
    sql`SELECT * FROM cabin`
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    });
});


app.get('/search/cabinId', (req, res) => {
  const { cabin_id } = req.query;

  sql`SELECT * FROM cabin WHERE id = ${cabin_id}`
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Database query failed');
  })
});


//***** Search availability ******/

// GET endpoint to check cabin availability
app.get('/api/cabins/availability', (req, res) => {
  try {
    // Extract start_date and end_date from query parameters
    const { start_date, end_date, destination, pets} = req.query;
    
    // Validate input parameters
    if (!start_date || !end_date || !destination || !pets) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both start_date and end_date are required query parameters'
      });
    }
    
    // Validate date formats
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date format. Please use YYYY-MM-DD format'
      });
    }
    
    // Validate that end date is not before start date
    if (endDate < startDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date cannot be before start date'
      });
    }
    
    
    sql`
      SELECT c. * 
      FROM cabin c 
      WHERE c.id NOT IN (
	      SELECT DISTINCT b.cabin_id
        FROM bookings b
        WHERE (
		      (b.start_date <= ${start_date} AND b.end_date > ${start_date}) OR
          (b.start_date < ${end_date} AND b.end_date >= ${end_date}) OR
          (b.start_date >= ${start_date} AND b.end_date <= ${end_date})
        )
      )
    
      AND (
        c.location = ${destination} OR		
        c.county= ${destination} OR
        c.name = ${destination} 
		
      )

      And (${pets} = 0 OR c.pets_allowed = ${pets})
    
    `
    .then(availableCabins =>{
      res.json(availableCabins);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    });


  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request'
    });
  }
});


// *******  Search cabin by name or location or county according to characters in the search input  ******

app.get('/cabin/search/byDesinationInput', (req, res) => {
  
  const { input_characters } = req.query;

  query1 = "SELECT DISTINCT county, location FROM cabin WHERE county LIKE ? OR location LIKE ?"
  query2 = "SELECT DISTINCT county, location, name FROM cabin WHERE county LIKE ? OR location LIKE ? OR name LIKE ?"

  
  const param = input_characters + '%';


  if(input_characters.length === 1){
    
    
    sql`
      SELECT DISTINCT county, location FROM cabin WHERE county LIKE ${param} OR location LIKE ${param}
    `
    .then(results => {
      const seen = new Set();
      const filtered = [];

      results.forEach(row => {
        if(row.county[0].toLowerCase() === input_characters.toLocaleLowerCase()){
          if(!seen.has(row.county)){
            filtered.push({ county: row.county });
            seen.add(row.county);
          }
        }


        if(row.location[0].toLowerCase() === input_characters.toLocaleLowerCase()){
            filtered.push(row);            
        }
      })
      res.json(filtered);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    })
  }

  



  if(input_characters.length > 1){
  
    sql`
    SELECT DISTINCT county, location, name FROM cabin WHERE county LIKE ${param} OR location LIKE ${param} OR name LIKE ${param}
    `
    .then(results => {
      const seen = new Set();
      const filtered = [];
  
      results.forEach(row => {
        if (row.county && row.county.toLowerCase().startsWith(input_characters.toLowerCase())) {
          const val = row.county;
          if (!seen.has(`county:${val}`)) {
            filtered.push({ county: val });
            seen.add(`county:${val}`);
          }
        }
  
        if (row.location && row.location.toLowerCase().startsWith(input_characters.toLowerCase())) {
          const val = row.location;
          if (!seen.has(`location:${val}`)) {
            filtered.push({ county: row.county, location: val });
            seen.add(`location:${val}`);
          }
          
        }

        if (row.name && row.name.toLowerCase().startsWith(input_characters.toLowerCase())) {
          const val = row.name;
          if (!seen.has(`name:${val}`)) {
            filtered.push({ county: row.county, location: row.location, name: val });
            seen.add(`name:${val}`);
          }
          
        }
      });
  
      res.json(filtered);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    })
  }
  

});



//Create booking for New User
app.post('/create/booking/newUser', (req, res) =>{
  
  const { user, booking } = req.body;
  
  sql`
  SELECT * FROM users WHERE email = ${user.email}
  `
  .then(existingUser => {
    let userId;

    if(existingUser.length > 0){
      res.json({message: "User already exists"});
    }
    else{
      bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        if(err) {
          console.error('Password hashing error:', err);
          return res.status(500).json({ message: 'Error creating user', error: err.message });
        }

        sql`
        INSERT INTO users (created_at, name, surname, email, password) VALUES (NOW(), ${user.name}, ${user.surname}, ${user.email}, ${hashedPassword})
        RETURNING id
        `
        .then(result => {
          userId = result[0].id;
          createBooking(userId, booking);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Database query failed');  
        })
      })
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Database query failed');
  })

  function createBooking(userId, booking){
    
    sql`
      INSERT INTO bookings (user_id, cabin_id, created_at, start_date, end_date) VALUES (${userId}, ${booking.cabin_id}, NOW(), ${booking.start_date}, ${booking.end_date})
    `
    .then(result => {
      res.json({message: "Booking created successfully"});
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    })
  }
});



//Create booking for Existing User

app.post('/create/booking/existingUser', (req, res) => {
  const {email, password, booking} = req.body;

  sql`
  SELECT * FROM users WHERE email = ${email}
  `
  .then(existingUser => {
    
    if(existingUser.length > 0){
      
      bcrypt.compare(password, existingUser[0].password, (err, match) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });
        }

        if(match){
          createBooking(existingUser[0].id, booking);
        }else{
          res.json({message: "Wrong email or password"});
        }
        
      });
      
    }else{
      res.json({message: "Wrong email or password"})
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Database query failed');
  })



  function createBooking(userId, booking){
    sql`
    INSERT INTO bookings (user_id, cabin_id, created_at, start_date, end_date) VALUES (${userId}, ${booking.cabin_id}, NOW(), ${booking.start_date}, ${booking.end_date})
    `
    .then(result =>{
      res.json({message: "Booking created successfully"});
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    })
  }
});


//Get reviews for cabin by cabin_id
app.get('/cabin/reviews', (req, res) => {
  const {cabin_id} = req.query;
  
      sql`
      SELECT * FROM reviews WHERE cabin_id = ${cabin_id}      
      `
      .then(reviews =>{
        res.json(reviews);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Database query failed');
      })
    
 
    
   
});

app.get('/search/user/name', (req, res) =>{
  const {user_id} = req.query

  sql`
  SELECT name FROM users WHERE id = ${user_id}
  `
  .then(name => {
    res.json(name);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Database query failed');
  })
});


//Create a review

app.post('/create/review', (req, res) => {

  const {email, password, cabin_id, review, rating} = req.body;
  
  sql`
  SELECT * FROM users WHERE email = ${email}
  `
  .then(user => {
    if(user.length > 0){
      
        bcrypt.compare(password, user[0].password, (err, match) => {
          if (err) {
            return res.status(500).json({ message: 'Error comparing passwords' });
          }
  
          if(match){
            //It also creates the review by  calling the createReview function within it
            check_booking_and_review(user[0].id);
          }else{
            res.json({message: "Wrong email or password"});
          }
          
        });
      }else{
        res.json({message: "Wrong email or password"});
      }
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Database query failed');
  })


  function check_booking_and_review(user_id){
    
    sql`
    SELECT 
    b.user_id,
    b.cabin_id,
    CASE 
        WHEN b.user_id IS NOT NULL AND r.user_id IS NOT NULL THEN 'Booking and Review Found'
        WHEN b.user_id IS NOT NULL AND r.user_id IS NULL THEN 'Booking Found, No Review'
        ELSE 'No Booking Found'
    END AS status
    FROM 
        bookings b
    LEFT JOIN 
        reviews r 
        ON b.user_id = r.user_id 
        AND b.cabin_id = r.cabin_id
    WHERE 
        b.user_id = ${user_id}   
        AND b.cabin_id = ${cabin_id}
    `
    .then(result => {
      if(result.length > 0){
        if(result[0].status === "Booking and Review Found"){
          res.json({message: "Booking and Review Found"});
        }else{
          createReview(user_id);
        }
      }else{
        res.json({message: "Booking not found"});
      }
      
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    })
  }



  function createReview(user_id){
  
    sql`
    INSERT INTO reviews (user_id, cabin_id, created_at, review, rating) VALUES (${user_id}, ${cabin_id}, NOW(), ${review}, ${rating})
    `
    .then(success => {
      sql`
      SELECT * FROM reviews WHERE cabin_id = ${cabin_id}
      `
      .then(reviews => {
        
        let ratingsSum = 0;
        let cabinRating;
        for(let j = 0; j < reviews.length; j++){
          ratingsSum = ratingsSum + parseInt(reviews[j].rating);
        };
        cabinRating = ratingsSum / reviews.length;
        console.log(cabinRating);
        
      sql`
      UPDATE cabin SET rating = ${cabinRating} WHERE id = ${cabin_id} 
      `
      .then(ratingUpdated => {
        
        res.json({message: "Review created successfully"})
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Database query failed');
      })
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Database query failed');
      })

    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database query failed');
    })
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})