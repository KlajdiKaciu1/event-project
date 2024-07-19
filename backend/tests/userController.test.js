const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const cookieParser = require('cookie-parser');
const { login } = require('../controllers/userController');
const { registerUser } = require('../controllers/userController'); 
const { userProfile } = require('../controllers/userController');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/login', login);
app.post('/register', registerUser);
app.get('/profile', userProfile);
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

describe('POST /register', () => {
  const mockSalt = 'mockSalt';
  
  beforeEach(() => {
    User.create.mockClear();
    bcrypt.genSaltSync.mockClear();
    bcrypt.hashSync.mockClear(); 
    bcrypt.genSaltSync.mockReturnValue(mockSalt); 
  });

  it('should register a user ', async () => {
    const mockUser = {
      name: 'Klajdi Kaciu',
      email: 'klajdikaciu@example.com',
      password: 'hashedpassword',
      isAdmin: false,
    };

    User.create.mockResolvedValue(mockUser);
    bcrypt.hashSync.mockReturnValue('hashedpassword');

    const response = await request(app)
      .post('/register')
      .send({
        name: 'Klajdi Kaciu',
        email: 'klajdikaciu@example.com',
        password: 'password',
        isAdmin: false,
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Klajdi Kaciu',
      email: 'klajdikaciu@example.com',
      password: 'hashedpassword',
      isAdmin: false,
    });
  });

  it('should return a 500 error if user registration fails', async () => {
    User.create.mockRejectedValue(new Error('Error registering value'));

    const response = await request(app)
      .post('/register')
      .send({
        name: 'Klajdi Kaciu',
        email: 'klajdikaciu@example.com',
        password: 'password',
        isAdmin: false,
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
    expect(User.create).toHaveBeenCalled();
  });
});

describe('GET /profile', () => {
  const jwtSecret = 'aerhtehwthegaeher';
  beforeEach(() => {
    User.findById.mockClear();
    jwt.verify.mockClear();
  });

  it('should return user profile for a valid token', async () => {
    const mockUser = {
      _id: 'userId123',
      name: 'Klajdi Kaciu',
      email: 'klajdikaciu@example.com',
    };

    jwt.verify.mockReturnValue({ id: mockUser._id });
    User.findById.mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/profile')
      .set('Cookie', [`token=validToken`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      _id: mockUser._id,
    });
    expect(jwt.verify).toHaveBeenCalledWith('validToken', jwtSecret);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
  });

  it('should return 404 if user is not found', async () => {
    jwt.verify.mockReturnValue({ id: 'userId123' });
    User.findById.mockResolvedValue(null);

    const response = await request(app)
      .get('/profile')
      .set('Cookie', [`token=validToken`]);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
    expect(jwt.verify).toHaveBeenCalledWith('validToken', jwtSecret);
    expect(User.findById).toHaveBeenCalledWith('userId123');
  });

  it('should return 500 for server error', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Token error');
    });

    const response = await request(app)
      .get('/profile')
      .set('Cookie', [`token=validToken`]);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Server error' });
    expect(jwt.verify).toHaveBeenCalledWith('validToken', jwtSecret);
  });
});