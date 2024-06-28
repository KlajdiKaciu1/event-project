const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const User=require('./models/User.js');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const app = express();
const bcryptSalt=bcrypt.genSaltSync(10);
const jwtSecret = 'aerhtehwthegaeher';
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

  mongoose.connect(process.env.MONGO_URL)
    .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); 
});

app.get('/test', (req, res) => {
    res.json('test ok');
  });

  app.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.status(201).json(userDoc); 
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' }); 
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (isMatch) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(401).json('Invalid password');
      }
    } else {
      res.status(404).json('User not found');
    }
  });
  
app.get('/profile', (req,res)=>{
  const {token}= req.cookies;
  if(token){
    jwt.verify(token,jwtSecret,{}, async(err,userData)=>{
      if(err) throw err;
      const {name,email,_id}=await User.findById(userData.id)
      res.json({name,email,_id});
    });
    }else{
      res.json(null);
    }

});
app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
});
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
