const socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');

  socket.on('alertMessage', (message) => {
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
  });

  socket.on('newMessage', (message) => {
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
  });

  socket.on('newLocationMessage', (message) => {
    let li = $('<li></li>');
    let a = $('<a target="_black">My location</a>');
    li.text(`${message.from}: `);
    a.attr('href', `${message.text}`);
    li.append(a);
    $('#messages').append(li);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  $('#message-form').on('submit', (event) => {
    event.preventDefault();
    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, (message) => {
      console.log(message);
    });
  })

  let locationButton = $('#send-location');
  locationButton.on('click', (event) => {
    event.preventDefault();
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      socket.emit('createLocationMessage', {
        from: 'User',
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, () => {
      alert('Unable to fetch location');
    })
  });
});