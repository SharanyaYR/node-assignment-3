const request = require('supertest');
const express = require('express');
const { createUser, updateUser, getUserList } = require('../controllers/UserController');
const User = require('../models/userModel');
const logger = require('../logger/log');

// Mock the User model and logger
jest.mock('../models/userModel');
jest.mock('../logger/log');

const app = express();
app.use(express.json());
app.post('/api/user', createUser);

// create
describe('POST /api/user', () => {
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'user1' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Please add all fields!');
    expect(logger.warn).toHaveBeenCalledWith('Missing fields in createUser request');
  });

  it('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ username: 'user1' });

    const res = await request(app)
      .post('/api/user')
      .send({ username: 'user1', name: 'User One', country: 'Country', city: 'City' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('user already present');
    expect(logger.warn).toHaveBeenCalledWith('User with username user1 already exists');
  });

  it('should create a new user and return 201', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      username: 'user1',
      name: 'User One',
      country: 'Country',
      city: 'City',
      isAdult: true,
    });

    const res = await request(app)
      .post('/api/user')
      .send({ username: 'user1', name: 'User One', country: 'Country', city: 'City', isAdult: true });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('created a user');
    expect(logger.info).toHaveBeenCalledWith('User created: user1');
  });
});

// update
app.put('/api/user/:username', updateUser);

describe('PUT /api/user/:username', () => {
  it('should return 404 if user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/user/user1')
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('User not found');
    expect(logger.warn).toHaveBeenCalledWith('usernotfound');
  });

  it('should return 400 if no data is provided', async () => {
    User.findOne.mockResolvedValue({ username: 'user1' });

    const res = await request(app)
      .put('/api/user/user1')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('No data provided for update');
    expect(logger.warn).toHaveBeenCalledWith('Empty update request body');
  });

  it('should update the user and return 200', async () => {
    const user = { username: 'user1', name: 'User One', country: 'Country', city: 'City', isAdult: true };
    User.findOne.mockResolvedValue(user);
    user.save = jest.fn().mockResolvedValue(user);

    const res = await request(app)
      .put('/api/user/user1')
      .send({ name: 'Updated Name', city: 'New City' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('User updated successfully');
    expect(logger.info).toHaveBeenCalledWith('User updated: user1');
  });
});

// get
app.get('/api/users', getUserList);

describe('GET /api/users', () => {
  it('should return 404 if no users are found', async () => {
    User.find.mockResolvedValue([]);

    const res = await request(app).get('/api/users');

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('No users found');
    expect(logger.info).toHaveBeenCalledWith('No users found');
  });

  it('should return 200 and the list of users', async () => {
    const users = [
      { username: 'user1', name: 'User One', country: 'Country', city: 'City', isAdult: true },
      { username: 'user2', name: 'User Two', country: 'Country2', city: 'City2', isAdult: false },
    ];
    User.find.mockResolvedValue(users);

    const res = await request(app).get('/api/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Users retrieved successfully');
    expect(logger.info).toHaveBeenCalledWith(`Retrieved ${users.length} users`);
  });
});