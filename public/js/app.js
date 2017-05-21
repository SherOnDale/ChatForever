const socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');

  socket.on('newMessage', (message) => {
    console.log(message);
  document.getElementById('message').innerHTML = JSON.stringify(message, undefined, 2);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});