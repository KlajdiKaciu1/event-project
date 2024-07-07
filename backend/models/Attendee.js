const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    name: String,
    phoneNumber: String,
    studyField: String,
    yearOfStudy: Number,
});

const AttendeeModel = mongoose.model('Attendee', attendeeSchema);
module.exports = AttendeeModel;
