const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodedbAuth',
  password: '@nodedbAuth',
  database: 'authentication'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const saveMessage = (roomId, message, sender) => {
  const query = 'INSERT INTO messages (room_id, message, sender) VALUES (?, ?, ?)';
  connection.query(query, [roomId, message, sender], (err, result) => {
    if (err) {
      console.error('Error saving message to database:', err);
      return;
    }
    console.log('Message saved to database');
  });
};

module.exports = { saveMessage };
