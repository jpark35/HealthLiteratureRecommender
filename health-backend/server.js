const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3002;
const SECRET_KEY = 'your_secret_key';

app.use(cors({
    origin: 'http://localhost:3001', // designated origin
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
  }));

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));  

// DEBUG: check payload size

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     console.log('Request payload size:', JSON.stringify(req.body).length);
//     next();
//   });

// Register User
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // DEBUG: log the incoming request
    // console.log('Register request received:', username); 

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
    if (err) {
        // DEBUG
    // console.error('Error inserting user:', err.message); // Log the error message
    return res.status(500).send('User registration failed');
    }
    res.status(200).send('User registered successfully');
    });
});

// Login User
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // console.log('Login request received:', username); // Log the incoming request

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user) {
        // console.error('Error finding user:', err ? err.message : 'User not found');
        return res.status(404).send('User not found');
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
    res.status(200).send({ auth: true, token });
    });
});

// Track Query
app.post('/query', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send('No token provided');

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send('Failed to authenticate token');

    const { query } = req.body;
    db.run(`INSERT INTO queries (user_id, query) VALUES (?, ?)`, [decoded.id, query], function(err) {
        if (err) {
            // console.error('Error inserting query:', err.message); // Log the error message
            return res.status(500).send('Failed to track query');
        }
        res.status(200).send('Query tracked successfully');
    });
    });
});

app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});
