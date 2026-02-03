const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// FIX: Adjust path for structure: server/server.js -> client/public/index.html
// 1. __dirname is '/.../server'
// 2. '..' goes up to root
// 3. 'client/public' goes down into the correct folder
const clientPath = path.join(__dirname, '../client/public');

console.log(`Serving static files from: ${clientPath}`);

// Serve static files (css, js, images) from that folder
app.use(express.static(clientPath));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
    const indexPath = path.join(clientPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send("Error loading chat. Check server logs.");
        }
    });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
