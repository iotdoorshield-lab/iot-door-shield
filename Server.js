const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
// Add CORS for file:// protocol
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
  res.send('🚪 IoT Door Shield Backend Running!');
});

// Auth Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'security123') {
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: 'admin',
        role: 'admin',
        token: 'demo_jwt_token_123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Persons Database
let persons = [
  { id: 1, name: "John Doe", relation: "Family", gender: "Male" },
  { id: 2, name: "Sarah Smith", relation: "Friend", gender: "Female" }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const newPerson = {
    id: persons.length + 1,
    ...req.body
  };
  persons.push(newPerson);
  res.json({ success: true, person: newPerson });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
};

connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});