const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A client is connected');

  socket.emit('alertMessage', generateMessage('Admin', 'Welcome to Chat Forever'));

  socket.broadcast.emit('alertMessage', generateMessage('Admin', 'A new user has joined the chat'));

  socket.on('createMessage', (message, callback) => {
    let receivedMessage = _.pick(message, ['from', 'text']);
    receivedMessage = generateMessage(receivedMessage.from, receivedMessage.text);
    io.emit('newMessage', receivedMessage);
    callback();
  });

  socket.on('createLocationMessage', (position, callback) => {
    socket.emit('newLocationMessage', generateLocationMessage(position));
    callback();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});