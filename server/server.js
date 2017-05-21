const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');
const {
  generateMessage
} = require('./utils/message');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A client is connected');

  socket.emit('welcomeMessage', generateMessage('Admin', 'Welcome to Chat Forever'));

  socket.broadcast.emit('newUserMessage', generateMessage('Admin', 'A new user has joined the chat'));

  socket.on('createMessage', (message, callback) => {
    let receivedMessage = _.pick(message, ['from', 'text']);
    receivedMessage = generateMessage(receivedMessage.from, receivedMessage.text);
    io.emit('newMessage', receivedMessage);
    console.log(receivedMessage);
    callback('Message Sent');
  });

  socket.on('createLocationMessage', (position) => {
    socket.emit('newMessage', generateMessage('User', `${position.lat}, ${position.lng}`));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});