const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const jwtSecret = 'aerhtehwthegaeher';
const Attendee=require('../models/Attendee.js');

const createEvent= (req,res)=>{
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
  }

  const getEventsByOwner = (req,res) =>{
    const {token}= req.cookies;
    jwt.verify(token,jwtSecret,{}, async(err,userData)=>{
      if(err) throw err;
      const {id} = userData; 
      res.json(await Event.find({owner:id}));
    });
  }
  const getEventById = async (req,res) =>{
    const {id} = req.params;
    res.json(await Event.findById(id));
  }
  const updateEvent = async (req, res) => {
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
  }
  const deleteEvent =  async (req, res) => {
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
  }
  const getAllEvents = async (req,res)=>{
    res.json(await Event.find());
   }
   const getJoinedEvents = (req, res) => {
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
}
module.exports ={createEvent, getEventsByOwner, getEventById, updateEvent, deleteEvent, getAllEvents, getJoinedEvents}