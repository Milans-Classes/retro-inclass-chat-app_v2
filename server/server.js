const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// FIX: Go up one level (../) to find the 'client' folder
// This assumes your structure is:
// /root
//   /client (contains index.html)
//   /server (contains server.js)
app.use(express.static(path.join(__dirname, '../client')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use the port Render gives you, or default to 3000 locally
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
