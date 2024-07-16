const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { login } = require('../controllers/userController');
const app = express();
app.use(express.json());
app.post('/login', login);
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('POST /login', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      email: 'test@example.com',
      password: 'hashedpassword',
      _id: '1',
      isAdmin: false,
    };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'fakeToken');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and token on successful login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(mockUser.email);
    expect(response.body._id).toBe(mockUser._id);
    expect(response.body.isAdmin).toBe(mockUser.isAdmin);
    expect(response.headers['set-cookie'][0]).toMatch(/token=fakeToken/);
  });

  it('should return 401 for invalid password', async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toBe('Invalid password');
  });

  it('should return 404 if user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({ email: 'false@example.com', password: 'password' });

    expect(response.status).toBe(404);
    expect(response.body).toBe('User not found');
  });
});
