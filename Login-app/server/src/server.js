const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const bcrypt = require('bcrypt');












require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5500', 
    credentials: true    
}));

app.use(cookieParser());

app.use(express.json());



app.get('/', (req, res) => {
    try {
    res.status(200).json({ message: 'Server works!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
  
});

const userRouter = require('./routes/userRoutes');
app.use('/user', userRouter);
const twoFactorAuth = require('./routes/twoFactorAutheticationRoutes');
app.use('/two-factor-authentication', twoFactorAuth);



app.listen(process.env.PORT || 3000, ()=>{
    console.log("App listening in port 3000!")
})