// server.js

const WebSocketServer = require('ws').Server;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveRoom, getAllRooms } = require('./roomController');
const { signup, login } = require('./authController');
const { saveMessage, getMessagesForRoom } = require('./messagesHandler'); // Import messagesHandler module

const app = express();
const port = 3030;

// WebSocket server
const wss = new WebSocketServer({ port: 8080 });
let clients = [];

app.use(cors());

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());

wss.on('connection', (connection) => {
    clients.push(connection);
    broadcast({ username: "admin", message: "User has entered the room" });

    connection.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'message') {
                // Save message to the database
                saveMessage(data.roomId, data.message, data.username);
                broadcast(data);
            } else if (data.type === 'join') {
                const { username, room } = data;
                if (username === 'ronaldo') {
                    saveRoom(room, (err, result) => {
                        if (err) {
                            console.error('Error saving room to database:', err);
                            return;
                        }
                        broadcastRooms();
                    });
                } else {
                    console.log('User', username, 'is not authorized to create rooms.');
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    connection.on('close', () => {
        clients = clients.filter(client => client !== connection);
        broadcast({ username: "admin", message: "A user has left the room" });
        broadcastRooms();
    });

    connection.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function broadcast(message) {
    const data = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    });
}

function broadcastRooms() {
    getAllRooms((err, rooms) => {
        if (err) {
            console.error('Error fetching rooms from database:', err);
            return;
        }
        broadcast({ type: 'room_update', rooms });
    });
}

app.post('/signup', (req, res) => {
    const { username, password, fullname } = req.body;
    signup(username, password, fullname, (err, result) => {
        if (err) {
            console.error('Error signing up user:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.status(201).send('User signed up successfully');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    login(username, password, (err, result) => {
        if (err) {
            console.error('Error logging in user:', err);
            res.status(500).send('Internal server error');
            return;
        }
        if (!result) {
            res.status(401).send('Incorrect username or password');
            return;
        }
        res.status(200).send('User signed in successfully');
    });
});

// Route to save message to the database
app.post('/messages', (req, res) => {
    const { roomId, message, sender } = req.body;
    saveMessage(roomId, message, sender, (err, result) => {
        if (err) {
            console.error('Error saving message:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.status(200).send('Message saved successfully');
    });
});

// Route to get messages for a specific room from the database
app.get('/messages/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    getMessagesForRoom(roomId, (err, messages) => {
        if (err) {
            console.error('Error fetching messages:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.status(200).json(messages);
    });
});

// Route to handle getting all rooms
app.get('/rooms', (req, res) => {
    getAllRooms((err, rooms) => {
        if (err) {
            console.error('Error fetching rooms from database:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.status(200).json(rooms);
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
