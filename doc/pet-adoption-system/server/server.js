// Main server file
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',     // Change to your MySQL username
  password: 'password',     // Change to your MySQL password
  database: 'pet_adoption',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ status: 'Database connection successful', data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all pets
app.get('/api/pets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Pet');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pet by ID
app.get('/api/pets/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Pet WHERE PetID = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Get medical records for this pet
    const [medicalRecords] = await pool.query(
      'SELECT * FROM MedicalRecord WHERE PetID = ?', 
      [req.params.id]
    );
    
    // Return pet with medical records
    res.json({
      pet: rows[0],
      medicalRecords: medicalRecords
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID with their adoption requests
app.get('/api/users/:id', async (req, res) => {
  try {
    // Get user info
    const [user] = await pool.query('SELECT UserID, Name, Email, PhoneNumber FROM User WHERE UserID = ?', [req.params.id]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get adoption requests for this user
    const [requests] = await pool.query(
      `SELECT ar.RequestID, ar.PetID, p.Name as PetName, ar.RequestDate, ar.Status 
       FROM AdoptionRequest ar 
       JOIN Pet p ON ar.PetID = p.PetID 
       WHERE ar.UserID = ?`, 
      [req.params.id]
    );
    
    // Return user with their requests
    res.json({
      user: user[0],
      adoptionRequests: requests
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (signup)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    
    // Generate a random user ID (in a real app, you would use auto-increment or UUID)
    const userId = Math.floor(Math.random() * 1000000);
    
    const [result] = await pool.query(
      'INSERT INTO User (UserID, Name, Email, Password, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, password, phoneNumber]
    );
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: userId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query(
      'SELECT UserID, Name, Email, PhoneNumber FROM User WHERE Email = ? AND Password = ?',
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      message: 'Login successful',
      user: users[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create adoption request
app.post('/api/adoption-requests', async (req, res) => {
  try {
    const { userId, petId } = req.body;
    
    // Generate a random request ID
    const requestId = Math.floor(Math.random() * 1000000);
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const [result] = await pool.query(
      'INSERT INTO AdoptionRequest (RequestID, UserID, PetID, RequestDate, Status) VALUES (?, ?, ?, ?, ?)',
      [requestId, userId, petId, currentDate, 'Pending']
    );
    
    res.status(201).json({ 
      message: 'Adoption request submitted successfully',
      requestId: requestId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pets by shelter ID
app.get('/api/pets/by-shelter/:shelterId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Pet WHERE ShelterID = ?', [req.params.shelterId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching shelter pets:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/shelters/:shelterId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Name, Location FROM Shelter WHERE ShelterID = ?', [req.params.shelterId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Shelter not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching shelter info:", error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});