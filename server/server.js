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
  
  socket.on('createMessage', (message) => {
    let recievedMessage = _.pick(message, ['name', 'text']);
    message.createdAt = new Date().getTime();
    io.emit('newMessage', message);
    console.log(message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});