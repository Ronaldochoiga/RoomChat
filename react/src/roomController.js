const mysql = require('mysql');

// MySQL database connection
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

// Function to save a new room to the database
function saveRoom(roomName, callback) {
    if (!roomName || roomName.trim() === '') {
        const error = new Error('Room name cannot be null or empty');
        callback(error, null);
        return;
    }

    connection.query('INSERT INTO rooms (name) VALUES (?)', [roomName], (err, result) => {
        if (err) {
            console.error('Error inserting room into rooms table:', err);
            callback(err, null);
            return;
        }
        console.log('Room created:', roomName);
        callback(null, result);
    });
}

// Function to retrieve all rooms from the database
function getAllRooms(callback) {
    connection.query('SELECT * FROM rooms', (err, results) => {
        if (err) {
            console.error('Error fetching rooms from database:', err);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

module.exports = { saveRoom, getAllRooms };
