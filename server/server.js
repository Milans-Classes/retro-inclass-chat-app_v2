const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const nodemailer = require('nodemailer');
const path = require('path');

app.use(express.static('public'));

let chatTranscript = [];

// 1. CONFIGURE YOUR EMAIL HERE
// For Gmail, search "Gmail App Password" to get a secure 16-character code
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'milan.inclass@gmail.com',
        pass: 'vepCas-2dunno-duczoz' 
    }
});

io.on('connection', (socket) => {
    console.log('User connected to Mac system');

    socket.on('chat message', (data) => {
        // Record message for the transcript (we skip the raw image data to keep emails small)
        chatTranscript.push({
            user: data.user,
            text: data.text || "[Image Shared]",
            time: new Date().toLocaleTimeString()
        });
        
        // Send message + image to all clients
        io.emit('chat message', data);
    });

    // This is triggered when you click the 'Close Box' on the 90s window
    socket.on('end-session', () => {
        if (chatTranscript.length === 0) return;

        let emailBody = "Retro Chat Session Transcript:\n\n";
        chatTranscript.forEach(m => {
            emailBody += `[${m.time}] ${m.user}: ${m.text}\n`;
        });

        const mailOptions = {
            from: 'milan.inclass@gmail.com',
            to: 'milan.inclass@gmail.com',
            subject: 'Chat Transcript',
            text: emailBody
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (!err) {
                console.log("Transcript emailed successfully.");
                chatTranscript = []; // Reset for next class
            }
        });
    });
});

http.listen(3000, () => console.log('Server active on port 3000'));
