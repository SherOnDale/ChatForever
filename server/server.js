const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const _ = require('lodash');
const fs = require('fs');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
const {
  isValidParam,
  isValidMessage
} = require('./utils/validate');
const {
  Users
} = require('./classes/users');
const port = process.env.PORT || 3000;
const users = new Users();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A client is connected');

  socket.on('join', (params, callback) => {
    let details = _.pick(params, ['name', 'room']);
    if (isValidParam(details)) {
      details.name = details.name.trim();
      details.room = details.room.trim().toLowerCase();
      socket.join(details.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, details.name, details.room);
      io.to(details.room).emit('updateUsersList', users.getUserList(details.room));
      socket.emit('alertMessage', generateMessage('Admin', 'Welcome to Chat Forever'));
      socket.broadcast.to(details.room).emit('alertMessage', generateMessage('Admin', `${details.name} has joined the chat`));
      callback();
    } else {
      callback('Please enter a valid name and room');
    }
  });

  socket.on('createMessage', (message, callback) => {
    let receivedMessage = _.pick(message, ['text']);
    let user = users.getUser(socket.id);
    if (user && isValidMessage(receivedMessage.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, receivedMessage.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (position, callback) => {
    let receivedMessage = _.pick(position, ['lat', 'lng']);
    let user = users.getUser(socket.id);
    if (user) {
      receivedMessage.from = user.name;
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(receivedMessage));
    }
    callback();

    
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      socket.broadcast.to(user.room).emit('leftMessage', generateMessage('Admin', `${user.name} has left the chat`));
    }
  });
});

app.use(express.static(path.join(__dirname, '../public')));


server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});