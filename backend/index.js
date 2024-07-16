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
const multer = require('multer');
const fs=require('fs');
const adminRoutes = require('./admin/adminRoutes');
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));
const { login } = require('./controllers/userController.js');
const { registerUser } = require('./controllers/userController.js');
const { logout } = require('./controllers/userController.js');
const { userProfile } = require('./controllers/userController.js');
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

  app.post('/register', registerUser);
  app.post('/login', login);
  app.post('/logout',logout);
  app.get('/profile', userProfile);
  
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
app.get('/joinedEvents', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try {
            const attendees = await Attendee.find({ userId: userData.id });
            const eventIds = attendees.map(attendee => attendee.eventId); 
            const events = await Event.find({ _id: { $in: eventIds } });
            res.json(events);
        } catch (error) {
            console.error('Error fetching joined events:', error);
            res.status(500).send('Server error');
        }
    });
});
app.use('/admin', adminRoutes);
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
