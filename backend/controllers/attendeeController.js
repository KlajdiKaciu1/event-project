const jwt = require('jsonwebtoken');
const jwtSecret = 'aerhtehwthegaeher';
const Attendee=require('../models/Attendee.js');
 
const addAttendee =  (req,res)=>{
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
  }
const getAttendeesByEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
      const attendees = await Attendee.find({ eventId });
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching attendees.' });
    }
  }
  module.exports ={addAttendee, getAttendeesByEvent}