const socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');

  socket.emit('createMessage', {
    from: 'Sherin',
    text: 'Hello Global'
  });
  
  socket.on('newMessage', (data) => {
    console.log(data);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});