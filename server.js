const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.log('MongoDB connection failed:', error);
  });

// Route 1: Basic check
app.get('/', (req, res) => {
  res.send('Suraksha Circle backend is running!');
});

// Route 2: GET all users from MongoDB
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Route 3: POST - create a real user in MongoDB
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created!', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// Route 4: DELETE - delete a user by id
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});