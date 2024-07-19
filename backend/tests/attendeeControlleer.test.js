const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');
const { addAttendee } = require('../controllers/attendeeController');
const { getAttendeesByEvent } = require('../controllers/attendeeController');
const Attendee = require('../models/Attendee');

jest.mock('jsonwebtoken');
jest.mock('../models/Attendee');

app.use(express.json());
app.use(cookieParser());
app.post('/attendees', addAttendee);
app.get('/attendee/:eventId', getAttendeesByEvent)

describe('POST /attendees', () => {
  beforeEach(() => {
    jwt.verify.mockClear();
    jest.clearAllMocks();
    Attendee.create.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add an attendee and return the attendee document', async () => {
    const mockUserId = 'user123';
    const mockAttendee = {
      userId: mockUserId,
      eventId: 'event123',
      name: 'Klajdi Kaciu',
      phoneNumber: '123',
      studyField: 'Computer Engineering',
      yearOfStudy: 1
    };


    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: mockUserId });
    });

    Attendee.create.mockResolvedValue(mockAttendee);

    const response = await request(app)
      .post('/attendees')
      .set('Cookie', ['token=valid-token'])
      .send({
        eventId: 'event123',
        name: 'Klajdi Kaciu',
        phoneNumber: '123',
        studyField: 'Computer Engineering',
        yearOfStudy: 1
      })
      .expect(200);

    expect(response.body).toEqual(mockAttendee);
  });
});

describe('GET /attendee/:eventId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch attendees for the given event ID', async () => {
    const mockEventId = 'event123';
    const mockAttendees = [
      { name: 'Klajdi Kaciu', eventId: mockEventId },
      { name: 'Klajdi Kaciu1', eventId: mockEventId }
    ];

    Attendee.find.mockResolvedValue(mockAttendees);

    const response = await request(app)
      .get(`/attendee/${mockEventId}`)
      .expect(200);

    expect(response.body).toEqual(mockAttendees);
    expect(Attendee.find).toHaveBeenCalledWith({ eventId: mockEventId });
  });
});