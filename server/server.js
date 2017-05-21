const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A client is connected');
  
  socket.emit('welcomeMessage', {
    name: 'Admin',
    text: 'Welcome to ChatForever',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newUserMessage', {
    name: 'Admin',
    text: 'A new user has joined the chat',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    let receivedMessage = _.pick(message, ['name', 'text']);
    receivedMessage.createdAt = new Date().getTime();
    io.emit('newMessage', receivedMessage);
    console.log(receivedMessage);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});