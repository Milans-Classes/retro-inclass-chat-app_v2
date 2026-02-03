const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname, 'chat_log.csv');

// Initialize CSV with headers if it doesn't exist
if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, 'Name,Email,Message\n');
}

// Inside your Socket.io connection logic
io.on('connection', (socket) => {
    socket.on('send-message', (data) => {
        // 1. Extract data (Assuming client sends { name, email, message })
        const { name, email, message } = data;

        // 2. Format for CSV (handle commas in messages by wrapping in quotes)
        const csvLine = `"${name}","${email}","${message.replace(/"/g, '""')}"\n`;

        // 3. Append to the file
        fs.appendFile(csvFilePath, csvLine, (err) => {
            if (err) console.error("Error saving to CSV:", err);
        });

        // 4. Broadcast the message to others as usual
        io.emit('receive-message', data);
    });
});
