// Import required modules
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

// Set up Socket.IO on the same server
const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files (HTML, CSS, JS, etc.) from the root directory
app.use(express.static(path.join(__dirname, ".."))); // Adjust as needed

// Optional: Serve index.html for the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Optional fallback for other routes if using a SPA
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "index.html"));
// });

// Store connected users
const users = {};

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("New user connected");

    // When a new user joins
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        io.emit("user-joined", name);
    });

    // When a message is sent
    socket.on("send", (message) => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id],
        });
    });

    // When a user disconnects
    socket.on("disconnect", () => {
        socket.broadcast.emit("leave", users[socket.id]);
        delete users[socket.id];
    });
});

// Use Render-assigned port or 8000 locally
const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
