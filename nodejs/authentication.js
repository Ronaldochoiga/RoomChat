const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodedbAuth', // replace with your MySQL username
  password: '@nodedbAuth', // replace with your MySQL password
  database: 'authentication' // replace with your MySQL database name
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Parse JSON request bodies
app.use(bodyParser.json());

// Sign-up endpoint
app.post('/signup', (req, res) => {
    const { fullname, username, password } = req.body;

  // Check if username is already taken
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.length > 0) {
      res.status(400).send('Username is already taken');
      return;
    }

    // Insert new user into the database
    connection.query('INSERT INTO users (fullname, username, password) VALUES (?, ?)', [fullname, username, password], (err) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        res.status(500).send('Internal server error');
        return;
      }
      res.status(201).send('User signed up successfully');
    });
  });
});

// Sign-in endpoint
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match a user in the database
  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Incorrect username or password');
      return;
    }

    res.status(200).send('User signed in successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
