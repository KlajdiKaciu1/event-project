const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    address: String,
    photos: [String],
    description: String,
    features: [String],
});

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;
