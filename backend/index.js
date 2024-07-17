const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const multer = require('multer');
const adminRoutes = require('./admin/adminRoutes');
const { login } = require('./controllers/userController.js');
const { registerUser } = require('./controllers/userController.js');
const { logout } = require('./controllers/userController.js');
const { userProfile } = require('./controllers/userController.js');
const { createEvent } = require('./controllers/eventController.js');
const { getEventsByOwner } = require('./controllers/eventController.js');
const { getEventById } = require('./controllers/eventController.js');
const { updateEvent } = require('./controllers/eventController.js');
const { deleteEvent } = require('./controllers/eventController.js');
const { getAllEvents } = require('./controllers/eventController.js');
const { getJoinedEvents } = require('./controllers/eventController.js');
const { addAttendee } = require('./controllers/attendeeController.js');
const { getAttendeesByEvent } = require('./controllers/attendeeController.js');
const { uploadPhotos } = require('./controllers/uploadController.js');
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

  app.post('/register', registerUser);
  app.post('/login', login);
  app.post('/logout',logout);
  app.get('/profile', userProfile);
  
 const photosMiddleware = multer({dest:'uploads/'});
 app.post('/upload', photosMiddleware.array('photos', 100), uploadPhotos);
 app.post('/events',  createEvent);
 app.get('/user-events', getEventsByOwner);
 app.get('/events/:id', getEventById);
 app.put('/events/:id',updateEvent);
 app.delete('/events/:id', deleteEvent);
 app.get('/events', getAllEvents);
 app.post('/attendees', addAttendee);
 app.get('/attendee/:eventId', getAttendeesByEvent)
 app.get('/joinedEvents',getJoinedEvents);
 app.use('/admin', adminRoutes);
 app.listen(4000, () => {
  console.log('Server is running on port 4000');
 });
