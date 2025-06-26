// Import required modules
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

// Create Socket.IO server on same HTTP server
const io = new Server(http, {
    cors: {
        origin: "*", // You can set specific origin here in production
        methods: ["GET", "POST"]
    }
});

// Serve static files (HTML, CSS, JS) from root directory
app.use(express.static(path.join(__dirname, "..")));

// Fallback route to serve index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Store users
const users = {};

// Socket.IO logic
io.on("connection", (socket) => {
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        io.emit("user-joined", name);
    });

    socket.on("send", (message) => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id],
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("leave", users[socket.id]);
        delete users[socket.id];
    });
});

// Start server on Render-assigned port
const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
