const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');
const fs = require('fs');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
const {
  isValidParam
} = require('./utils/validate');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A client is connected');

  socket.on('join', (params, callback) => {
    let details = _.pick(params, ['name', 'room']);
    if (isValidParam(details)) {
      details.name = details.name.trim();
      details.room = details.room.trim();
      socket.join(details.room);
      socket.emit('alertMessage', generateMessage('Admin', 'Welcome to Chat Forever'));
      socket.broadcast.to(details.room).emit('alertMessage', generateMessage('Admin', `${details.name} has joined the chat`));
      callback();
    } else {
      callback('Please enter a valid name and room');
    }
  });

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
    socket.broadcast.emit('leftMessage', generateMessage('Admin', 'A user has left the chat'));
  });
});

app.use(express.static(path.join(__dirname, '../public')));


server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});