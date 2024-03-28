const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodedbAuth', // Replace with your MySQL username
    password: '@nodedbAuth', // Replace with your MySQL password
    database: 'authentication' // Replace with your MySQL database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

function signup(username, password, fullname, callback) {
    // Check if username is already taken
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            callback(err);
            return;
        }

        if (results.length > 0) {
            callback('Username is already taken. Please choose a different username.');
            return;
        }

        // Insert new user into the database
        connection.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, password], (err) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                callback(err);
                return;
            }
            callback(null, 'User signed up successfully');
        });
    });
}

function login(username, password, callback) {
    // Check if username and password match a user in the database
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            callback(err, null);
            return;
        }

        if (results.length === 0) {
            callback(null, false); // No user found with given credentials
            return;
        }

        callback(null, true); // User found with given credentials
    });
}

module.exports = { signup, login };
