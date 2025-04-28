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

// Keyword search endpoint
app.get('/api/pets/search', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const type = req.query.type || '';
    const size = req.query.size || '';
    
    // Build query with multiple conditions
    let queryParams = [];
    let query = `
      SELECT p.*, s.Name AS ShelterName 
      FROM Pet p
      JOIN Shelter s ON p.ShelterID = s.ShelterID
      WHERE 1=1
    `;
    
    // Add keyword search
    if (keyword) {
      query += ` AND (p.Name LIKE ? OR p.Breed LIKE ? OR p.Color LIKE ? OR CAST(p.PetID AS CHAR) LIKE ?)`;
      const keywordParam = `%${keyword}%`;
      queryParams.push(keywordParam, keywordParam, keywordParam, keywordParam);
    }
    
    // Add filters
    if (type) {
      query += ` AND p.Type = ?`;
      queryParams.push(type);
    }
    
    if (size) {
      query += ` AND p.Size = ?`;
      queryParams.push(size);
    }
    
    // Add sorting
    query += ` ORDER BY p.DateOfIntake DESC`;
    
    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error searching pets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Call stored procedure endpoint
app.get('/api/pets/suitable', async (req, res) => {
  try {
    const { userId, petType, maxAge, size } = req.query;
    
    // Call the stored procedure
    const [results] = await pool.query(
      'CALL FindSuitablePets(?, ?, ?)',
      [petType || 'Dog', maxAge || 10, size || '']
    );
    
    // MySQL2 returns stored procedure results in a different format
    const pets = results[0]; // First result set has the matching pets
    const shelters = results[1] || []; // Second result set has the shelters (if exists)
    
    res.json({
      pets: pets,
      recommendedShelters: shelters
    });
  } catch (error) {
    console.error('Error calling stored procedure:', error);
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

// Get all pets with filtering
app.get('/api/pets', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const type = req.query.type;
    
    let query = 'SELECT * FROM Pet WHERE 1=1';
    const params = [];
    
    if (keyword) {
      query += ' AND (Name LIKE ? OR Breed LIKE ? OR CAST(PetID AS CHAR) LIKE ?)';
      const keywordParam = `%${keyword}%`;
      params.push(keywordParam, keywordParam, keywordParam);
    }
    
    if (type) {
      query += ' AND Type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY DateOfIntake DESC';
    
    const [rows] = await pool.query(query, params);
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

// Get all shelters
app.get('/api/shelters', async (req, res) => {
  try {
    const [shelters] = await pool.query(`
      SELECT s.ShelterID, s.Name, s.Location, COUNT(p.PetID) as PetCount
      FROM Shelter s
      LEFT JOIN Pet p ON s.ShelterID = p.ShelterID
      GROUP BY s.ShelterID, s.Name, s.Location
      ORDER BY PetCount DESC
    `);
    
    res.json(shelters);
  } catch (error) {
    console.error("Error fetching shelters:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get shelter info
app.get('/api/senior-pets-report', async (req, res) => {
  try {
    const [rows] = await pool.query(
      ` 
      SELECT
        s.ShelterID,
        s.Name AS ShelterName,
        p.Type AS PetType,
        COUNT(*) AS AvailablePetCount
      FROM Shelter s
      JOIN Pet p ON p.ShelterID = s.ShelterID
      LEFT JOIN AdoptionRequest ar
             ON ar.PetID = p.PetID
            AND ar.Status IN ('Pending','Approved')
      WHERE ar.RequestID IS NULL
        AND (
              (UPPER(p.Type) = 'CAT' AND p.Age >= 10)
           OR (UPPER(p.Type) = 'DOG' AND p.Age >= 8)
            )
      GROUP BY s.ShelterID, s.Name, p.Type
      ORDER BY AvailablePetCount DESC;`
    );

    res.json(rows);
  } catch (err) {
    console.error('Senior-pets query failed:', err.message);
    res.status(500).json({ error: 'Senior pets report failed' });
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

// Process adoption request using transaction
app.put('/api/adoption-requests/:id/process', async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    if (!['Approved', 'Rejected', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Approved, Rejected, or Cancelled' });
    }
    
    // Call the transaction procedure
    const [results] = await pool.query(
      'CALL ProcessAdoptionRequest(?, ?)',
      [requestId, status]
    );
    
    const resultMessage = results[0] && results[0][0] ? results[0][0].Message : 'Request processed successfully';
    
    res.json({ 
      message: resultMessage,
      status: status
    });
  } catch (error) {
    console.error('Error processing adoption request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get adoption statistics (from trigger data)
app.get('/api/statistics', async (req, res) => {
  try {
    // Get statistics with Shelter ID included
    const [stats] = await pool.query(`
      SELECT 
        s.ShelterID,
        s.Name AS ShelterName,
        p.Type AS PetType,
        COUNT(CASE WHEN ar.Status = 'Approved' THEN 1 END) AS TotalAdoptions,
        COUNT(ar.RequestID) AS TotalRequests,
        MAX(ar.RequestDate) AS LastUpdated
      FROM 
        AdoptionRequest ar
        JOIN Pet p ON ar.PetID = p.PetID
        JOIN Shelter s ON p.ShelterID = s.ShelterID
      GROUP BY 
        s.ShelterID, s.Name, p.Type
      ORDER BY 
        TotalAdoptions DESC, TotalRequests DESC
    `);
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting adoption statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new medical record
app.post('/api/medical-records', async (req, res) => {
  try {
    const { petId, date, description, vetName } = req.body;
    
    // Generate a random ID (in a real app, use auto-increment)
    const recordId = Math.floor(Math.random() * 1000000);
    
    const [result] = await pool.query(
      'INSERT INTO MedicalRecord (RecordID, PetID, Date, Description, VetName) VALUES (?, ?, ?, ?, ?)',
      [recordId, petId, date, description, vetName]
    );
    
    res.status(201).json({
      message: 'Medical record added successfully',
      recordId: recordId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pet information
app.put('/api/pets/:id', async (req, res) => {
  try {
    const { name, breed, age, size, color } = req.body;
    
    const [result] = await pool.query(
      'UPDATE Pet SET Name = ?, Breed = ?, Age = ?, Size = ?, Color = ? WHERE PetID = ?',
      [name, breed, age, size, color, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    res.json({ message: 'Pet updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete pet
app.delete('/api/pets/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Pet WHERE PetID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/senior-pets-report', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        s.ShelterID,
        s.Name  AS ShelterName,
        p.Type  AS PetType,
        COUNT(*) AS AvailablePetCount
      FROM Shelter  s
      JOIN Pet      p  ON p.ShelterID = s.ShelterID
      LEFT JOIN AdoptionRequest ar
             ON ar.PetID = p.PetID
            AND ar.Status IN ('Pending','Approved')
      WHERE ar.RequestID IS NULL
        AND (
              (UPPER(p.Type) = 'CAT' AND p.Age >= 10)
           OR (UPPER(p.Type) = 'DOG' AND p.Age >= 8)
            )
      GROUP BY s.ShelterID, s.Name, p.Type
      ORDER BY AvailablePetCount DESC;
    `);

    res.json(rows);            // always send the real rows
  } catch (err) {
    console.error('Senior-pets query failed:', err.message);
    res.status(500).json({ error: 'Senior pets report failed' });
  }
});
// Delete a pending adoption request
app.delete('/api/adoption-requests/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log('Received delete request for ID:', requestId);
    
    // First check if the request exists and is pending
    const [requests] = await pool.query(
      'SELECT Status FROM AdoptionRequest WHERE RequestID = ?',
      [requestId]
    );
    
    if (requests.length === 0) {
      console.log('Request not found');
      return res.status(404).json({ error: 'Request not found' });
    }
    
    console.log('Request status:', requests[0].Status);
    
    if (requests[0].Status !== 'Pending') {
      return res.status(400).json({ 
        error: 'Only pending requests can be deleted' 
      });
    }
    
    // Delete the request
    const [result] = await pool.query(
      'DELETE FROM AdoptionRequest WHERE RequestID = ?',
      [requestId]
    );
    
    console.log('Delete result:', result);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ 
        error: 'Failed to delete request' 
      });
    }
    
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting adoption request:', error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.get('/api/shelters/search', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    
    let query = `
      SELECT 
        s.ShelterID, 
        s.Name, 
        s.Location, 
        COUNT(p.PetID) as PetCount
      FROM 
        Shelter s
      LEFT JOIN 
        Pet p ON s.ShelterID = p.ShelterID
      WHERE 
        s.Name LIKE ?
      GROUP BY 
        s.ShelterID, s.Name, s.Location
      ORDER BY 
        s.Name
    `;
    
    const [shelters] = await pool.query(query, [`%${keyword}%`]);
    res.json(shelters);
  } catch (error) {
    console.error("Error searching shelters:", error);
    res.status(500).json({ error: error.message });
  }
});
