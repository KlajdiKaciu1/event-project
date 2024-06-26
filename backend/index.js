const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const User=require('./models/User.js')
require('dotenv').config();
const app = express();
const bcryptSalt=bcrypt.genSaltSync(10);
app.use(express.json());
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
  process.exit(1); // Exit process on connection failure
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

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
