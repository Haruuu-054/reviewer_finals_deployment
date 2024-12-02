// Import required packages
const express = require('express');
const cors = require('cors'); // Import CORS
const path = require('path'); // Built-in Node.js package for file paths
const mysql = require('mysql'); // Import MySQL
const moment = require('moment'); // Import Moment.js for timestamps

// Initialize Express app
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'https://haruuu-054.github.io', // Replace with your frontend's URL
}));

// Set the port
const PORT = process.env.PORT || 5000;

// MySQL connection
const connection = mysql.createConnection({
    host: 'be3wejepmdne8hznkcpv-mysql.services.clever-cloud.com',
    user: 'ugf080ugivrp3kcf',
    password: '4I6dKBLGvJYJWCfEdMYu',
    database: 'be3wejepmdne8hznkcpv',
});

// Connect to MySQL
connection.connect();

// Middleware for logging
const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`);
    next();
};

// Use middlewares
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes

// Get all members
app.get('/api/members', (req, res) => {
    connection.query('SELECT * FROM userdata', (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

// Get a member by ID
app.get('/api/members/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`SELECT * FROM userdata WHERE id='${id}'`, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(400).json({ msg: `${id} ID not found!` });
        }
    });
});

// Add a new member
app.post('/api/members', (req, res) => {
    const { first_name, last_name, email, gender } = req.body;
    connection.query(
        `INSERT INTO userdata (first_name, last_name, email, gender) VALUES ('${first_name}', '${last_name}', '${email}', '${gender}')`,
        (err) => {
            if (err) throw err;
            res.json({ msg: `Successfully inserted!` });
        }
    );
});

// Update a member
app.put('/api/members', (req, res) => {
    const { first_name, last_name, email, gender, id } = req.body;
    connection.query(
        `UPDATE userdata SET first_name='${first_name}', last_name='${last_name}', email='${email}', gender='${gender}' WHERE id='${id}'`,
        (err) => {
            if (err) throw err;
            res.json({ msg: `Successfully updated!` });
        }
    );
});

// Delete a member
app.delete('/api/members', (req, res) => {
    const { id } = req.body;
    connection.query(`DELETE FROM userdata WHERE id='${id}'`, (err) => {
        if (err) throw err;
        res.json({ msg: `Successfully deleted!` });
    });
});

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
