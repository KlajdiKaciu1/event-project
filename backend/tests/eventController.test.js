const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const Event = require('../models/Event'); 
const Attendee = require('../models/Attendee');
const { createEvent } = require('../controllers/eventController');
const { getEventsByOwner } = require('../controllers/eventController');
const { getEventById } = require('../controllers/eventController');
const { updateEvent } = require('../controllers/eventController'); 
const { deleteEvent } = require('../controllers/eventController');
const { getJoinedEvents } = require('../controllers/eventController');

jest.mock('jsonwebtoken');
jest.mock('../models/Event');
jest.mock('../models/Attendee');

app.use(express.json());
app.use(cookieParser());
app.post('/events', createEvent);
app.get('/user-events', getEventsByOwner);
app.get('/events/:id', getEventById);
app.put('/events/:id', updateEvent);
app.delete('/events/:id', deleteEvent);
app.get('/joinedEvents',getJoinedEvents);

describe('POST /events', () => {
  beforeEach(() => {
    jwt.verify.mockClear();
    jest.clearAllMocks();
    Event.create.mockClear();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an event and return the event document', async () => {
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 'user123' });
    });
    Event.create.mockResolvedValue({
      _id: 'event123',
      owner: 'user123',
      title: 'Test Event',
      address: '123 Test St',
      photos: ['photo1.jpg'],
      description: 'A test event',
      features: ['feature1'],
      selectedDate: '2024-07-18',
    });

    const response = await request(app)
      .post('/events')
      .set('Cookie', ['token=valid-token'])
      .send({
        title: 'Test Event',
        address: '123 Test St',
        addedPhotos: ['photo1.jpg'],
        description: 'A test event',
        features: ['feature1'],
        selectedDate: '2024-07-18',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: 'event123',
      owner: 'user123',
      title: 'Test Event',
      address: '123 Test St',
      photos: ['photo1.jpg'],
      description: 'A test event',
      features: ['feature1'],
      selectedDate: '2024-07-18',
    });
  });
});

describe('GET /user-events', () => {
    beforeEach(() => {
      jwt.verify.mockClear();
      Event.find.mockClear();
    });
  
    it('should return events for the owner', async () => {
      jwt.verify.mockImplementation((token, secret, options, callback) => {
        callback(null, { id: 'user123' });
      });
      const mockEvents=[
        { _id: 'event123', title: 'Test Event 1', address: 'Polytech UNI', photos: ['photo1.jpg'] },
        { _id: 'event124', title: 'Test Event 2', address: 'Polytech UNI', photos: ['photo2.jpg'] }
      ];
      Event.find.mockResolvedValue(mockEvents);
  
      const response = await request(app)
        .get('/user-events')
        .set('Cookie', ['token=valid-token']);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });
  });

  describe('GET /events/:id', () => {
    beforeEach(() => {
      Event.findById.mockClear();
    });
  
    it('should return the event for the given ID', async () => {
      const mockEvent = {
        _id: 'event123',
        title: 'Test Event',
        address: 'Polytech UNI',
        photos: ['photo1.jpg'],
        description: 'This is an event',
        features: ['feature1'],
        selectedDate: '2024-07-18',
      };
  
      Event.findById.mockResolvedValue(mockEvent);
  
      const response = await request(app)
        .get('/events/event123')
        .expect(200);
  
      expect(response.body).toEqual(mockEvent);
    });
  });
  describe('PUT /events/:id', () => {
    beforeEach(() => {
      jwt.verify.mockReset();
      Event.findById.mockReset();
    });
  
    it('should update the event if the user is authorized', async () => {
      const mockEvent = {
        _id: 'event123',
        owner: 'user123',
        title: 'Old Title',
        address: 'Old Address',
        photos: ['oldPhoto.jpg'],
        description: 'Old description',
        features: ['oldFeature'],
        selectedDate: '2024-07-01',
        set: jest.fn(),
        save: jest.fn().mockResolvedValue('ok'),
      };
  
      jwt.verify.mockImplementation((token, secret, options, callback) => {
        callback(null, { id: 'user123' });
      });
  
      Event.findById.mockResolvedValue(mockEvent);
  
      const response = await request(app)
        .put('/events/event123')
        .set('Cookie', ['token=valid-token'])
        .send({
          title: 'New Title',
          address: 'New Address',
          addedPhotos: ['newPhoto.jpg'],
          description: 'New description',
          features: ['newFeature'],
          selectedDate: '2024-07-18',
        })
        .expect(200);
  
      expect(response.body).toBe('ok');
      expect(mockEvent.set).toHaveBeenCalledWith({
        title: 'New Title',
        address: 'New Address',
        photos: ['newPhoto.jpg'],
        description: 'New description',
        features: ['newFeature'],
        selectedDate: '2024-07-18',
      });
      expect(mockEvent.save).toHaveBeenCalled();
    });
  });

  describe('DELETE /events/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
  
    it('should delete the event if the user is authorized', async () => {
      const mockEvent = {
        _id: 'event123',
        owner: 'user123',
      };
  
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 'user123' });
      });
  
      Event.findById.mockResolvedValue(mockEvent);
      Event.findByIdAndDelete.mockResolvedValue(mockEvent);
  
      const response = await request(app)
        .delete('/events/event123')
        .set('Cookie', ['token=valid-token'])
        .expect(200);
  
      expect(response.body.message).toBe('Event deleted successfully');
      expect(Event.findByIdAndDelete).toHaveBeenCalledWith('event123');
    });
  
    it('should return 403 if the user is not the owner', async () => {
      const mockEvent = {
        _id: 'event123',
        owner: 'otherUser',
      };
  
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 'user123' });
      });
  
      Event.findById.mockResolvedValue(mockEvent);
  
      const response = await request(app)
        .delete('/events/event123')
        .set('Cookie', ['token=valid-token'])
        .expect(403);
  
      expect(response.body.error).toBe('Permission denied');
    });
  });

describe('GET /joinedEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return joined events for the user', async () => {
    const mockUserId = 'user123';
    const mockEvents = [
      { _id: 'event1', title: 'Event 1' },
      { _id: 'event2', title: 'Event 2' }
    ];

    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: mockUserId });
    });


    Attendee.find.mockResolvedValue([
      { userId: mockUserId, eventId: 'event1' },
      { userId: mockUserId, eventId: 'event2' }
    ]);

    Event.find.mockResolvedValue(mockEvents);

    const response = await request(app)
      .get('/joinedEvents')
      .set('Cookie', ['token=valid-token'])
      .expect(200);

    expect(response.body).toEqual(mockEvents);
  });
});
  