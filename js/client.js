// ensure that the server is running on port 8000
const socket = io('http://localhost:8000');

// Ensure that the HTML elements are correctly linked
// This code handles the client-side logic for a chat application using Socket.IO
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Ensure that the audio file is correctly linked
var audio = new Audio('assets/tune.mp3');

// Function to append messages to the chat container
// This function creates a new message element and appends it to the message container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex');
    if (position === 'right') {
        messageElement.classList.add('justify-end');
        messageElement.innerHTML = `<div class="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[70%]">${message}</div>`;
    } else {
        messageElement.innerHTML = `<div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%]">${message}</div>`;
    }
    messageContainer.append(messageElement);

//if the message is from the left side, play the audio
// This plays a notification sound when a new message is received from the left side
    if (position == 'left') {
        audio.play();
    }
};

//this code listens for the 'submit' event on the form
// When the form is submitted, it prevents the default action, retrieves the message from the input
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// this code prompts the user for their name to join the chat
// It emits a 'new-user-joined' event with the user's name to the server
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// this code listens for the 'user-joined' event from the server
// When a new user joins, it appends a message to the chat indicating that the user has joined
socket.on('user-joined', name => {
    const messageElement = document.createElement('div');
    messageElement.className = "text-center text-gray-500 text-sm my-2";
    messageElement.innerText = `${name} joined the chat`;
    messageContainer.append(messageElement);
});

// this code listens for the 'receive' event from the server
// When a message is received, it appends the message to the chat container
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// this code listens for the 'leave' event from the server
// When a user leaves the chat, it appends a message to the chat indicating that the user has left

socket.on('leave', name => {
    const messageElement = document.createElement('div');
    messageElement.className = "text-center text-gray-500 text-sm my-2";
    messageElement.innerText = `${name} left the chat`;
    messageContainer.append(messageElement);
});