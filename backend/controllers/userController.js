const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const jwtSecret = 'aerhtehwthegaeher';
const bcryptSalt=bcrypt.genSaltSync(10);
const login = async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (isMatch) {
        jwt.sign({   
          email:userDoc.email,
          id:userDoc._id,
          isAdmin: userDoc.isAdmin
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
  }
const registerUser = async (req, res) => {
    try {
      const { name, email, password, isAdmin } = req.body;
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
        isAdmin: isAdmin || false, 
      });
      res.status(201).json(userDoc); 
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' }); 
    }
  };
const logout = (req,res)=>{
  res.cookie('token','').json(true);
}
const userProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const userData = jwt.verify(token, jwtSecret);
      const user = await User.findById(userData.id);
      if (user) {
        const { name, email, _id } = user;
        res.json({ name, email, _id });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
  module.exports = { login, registerUser, logout, userProfile };