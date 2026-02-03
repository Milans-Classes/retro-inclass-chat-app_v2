const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Adjust path for structure: server/server.js -> client/public/index.html
const clientPath = path.join(__dirname, '../client/public');

app.use(express.static(clientPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

io.on('connection', (socket) => {
    // 1. Handle Joining a specific Session (Room)
    socket.on('join room', (roomCode) => {
        socket.join(roomCode);
        console.log(`User joined room: ${roomCode}`);
    });

    // 2. Handle Chat Messages (Only send to specific room)
    socket.on('chat message', (data) => {
        // data = { room, user, text, timestamp, role }
        io.to(data.room).emit('chat message', data);
    });

    // 3. Handle Session End (Instructor only)
    socket.on('end session', (roomCode) => {
        io.to(roomCode).emit('session ended');
    });

    socket.on('disconnect', () => {
        // Standard disconnect
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
