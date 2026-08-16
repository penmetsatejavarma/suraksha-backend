const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Route 1: Basic check
app.get('/', (req, res) => {
  res.send('Suraksha Circle backend is running!');
});

// Route 2: GET all users
app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'Ramu', role: 'senior' },
    { id: 2, name: 'Priya', role: 'caregiver' },
    { id: 3, name: 'Arjun', role: 'volunteer' }
  ];
  res.json(users);
});

// Route 3: POST - add a new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  console.log('New user received:', newUser);
  res.json({ message: 'User received!', user: newUser });
});

// Route 4: PUT - update a user by id
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  console.log(`Updating user ${id} with:`, updatedData);
  res.json({ message: `User ${id} updated!`, updatedData });
});

// Route 5: DELETE - delete a user by id
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Deleting user ${id}`);
  res.json({ message: `User ${id} deleted!` });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});