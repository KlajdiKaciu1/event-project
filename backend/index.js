const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const User=require('./models/User.js');
const Event=require('./models/Event.js');
const Attendee=require('./models/Attendee.js')
const jwt=require('jsonwebtoken');
require('dotenv').config();
const app = express();
const bcryptSalt=bcrypt.genSaltSync(10);
const jwtSecret = 'aerhtehwthegaeher';
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs=require('fs');

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
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
        jwt.sign({   //jwt can be stored in cookies
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

 const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/',''));
  }
  res.json(uploadedFiles);
});
app.post('/events', (req,res)=>{
  const {token}= req.cookies;
  const {title,address,addedPhotos,description,features,selectedDate} =req.body;
  jwt.verify(token,jwtSecret,{}, async(err,userData)=>{
    if(err) throw err;
    const eventDoc = await Event.create({
     owner: userData.id,
     title,address,photos:addedPhotos,description,features,selectedDate,
    });
    res.json(eventDoc);
  });
});
app.get('/user-events', (req,res) =>{
  const {token}= req.cookies;
  jwt.verify(token,jwtSecret,{}, async(err,userData)=>{
    if(err) throw err;
    const {id} = userData; 
    res.json(await Event.find({owner:id}));
  });
});
app.get('/events/:id', async (req,res) =>{
  const {id} = req.params;
  res.json(await Event.findById(id));
});
app.put('/events/:id', async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  const { title, address, addedPhotos, description, features, selectedDate } = req.body;
  
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      
      const eventDoc = await Event.findById(id);
      if (userData.id === eventDoc.owner.toString()) {
          eventDoc.set({ title, address, photos: addedPhotos, description, features, selectedDate });
          await eventDoc.save();
          res.json('ok');
      } else {
          res.status(403).json('Unauthorized');
      }
  });
});
app.delete('/events/:id', async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  try {
    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) throw err;
      const event = await Event.findById(id);
      if (userData.id !== event.owner.toString()) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      await Event.findByIdAndDelete(id);
      res.json({ message: 'Event deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting event:', error);
  }
});
app.get('/events', async (req,res)=>{
 res.json(await Event.find());
});
app.post('/attendees', (req,res)=>{
  const {token}= req.cookies;
  const {eventId, name, phoneNumber,studyField,yearOfStudy,} =req.body;
  jwt.verify(token,jwtSecret,{}, async(err,userData)=>{
    if(err) throw err;
    const attendeeDoc = await Attendee.create({
     userId: userData.id,
     eventId, name, phoneNumber,studyField,yearOfStudy
    });
    res.json(attendeeDoc);
  });
});
app.get('/attendee/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const attendees = await Attendee.find({ eventId });
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching attendees.' });
  }
})
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
