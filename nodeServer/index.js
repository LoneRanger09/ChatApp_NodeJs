// import module is socket.io for Node.js
// This code sets up a simple chat server using Socket.IO
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(8000, {
// why cross-origin resource sharing (CORS) is needed
    // CORS is needed to allow the client-side application running on a different port (e.g., 5500) to connect to the Socket.IO server running on port 8000.
    cors: {
        origin: ["*"],
        methods: ["GET", "POST"]
    }
});
// this object will store the names of users connected to the chat
const users = {};

// this code listens for new connections to the Socket.IO server

// when a new user joins, it emits a 'user-joined' event to all connected clients
// and stores the user's name in the 'users' object with the socket ID as the key
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        io.emit('user-joined', name); // <--- correct line
    });

// when a message is sent, it emits a 'receive' event to all connected clients
// the message includes the message content and the name of the user who sent it
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    
});

// when a user disconnects, it emits a 'leave' event to all connected clients
// and removes the user from the 'users' object
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});