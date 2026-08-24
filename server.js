const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const seniorProfileRoutes = require('./routes/seniorProfile');
const protect = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.log('MongoDB connection failed:', error));

// Public routes (no token needed)
app.get('/', (req, res) => {
  res.send('Suraksha Circle backend is running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/senior', seniorProfileRoutes);

// Protected routes (token required)
app.get('/api/users', protect, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users, requestedBy: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.get('/api/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});