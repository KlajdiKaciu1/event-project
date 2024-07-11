const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const router = express.Router();

const jwtSecret = 'aerhtehwthegaeher';

function verifyAdmin(req, res, next) {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, async (err, userData) => {
    if (err) return res.status(403).json('Unauthorized');
    const user = await User.findById(userData.id);
    if (user && user.isAdmin) {
      req.user = user;
      next();
    } else {
      res.status(403).json('Unauthorized');
    }
  });
}
router.get('/users', verifyAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});


router.delete('/users/:id', verifyAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json('User deleted');
});

router.get('/events', verifyAdmin, async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.delete('/events/:id', verifyAdmin, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json('Event deleted');
});
router.get('/events/:id', async (req,res) =>{
  const {id} = req.params;
  res.json(await Event.findById(id));
});
router.put('/events/:id',verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, address, addedPhotos, description, features, selectedDate } = req.body;
      const eventDoc = await Event.findById(id);
          eventDoc.set({ title, address, photos: addedPhotos, description, features, selectedDate });
          await eventDoc.save();
          res.json('ok');
});


module.exports = router;
