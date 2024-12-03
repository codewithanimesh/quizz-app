const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const questions = require('./questions');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // Update this to your React app's URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('getQuestion', (index) => {
    if (index < questions.length) {
      console.log(`Sending question ${index}: ${questions[index]}`);
      socket.emit('question', questions[index]);
    } else {
      socket.emit('question', 'No more questions');
    }
  });

  socket.on('submitAnswer', (data) => {
    io.emit('newAnswer', data);
  });
});

server.listen(4000, () => console.log('Server running on port 4000'));