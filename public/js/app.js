const socket = io();


socket.on('connect', () => {
  console.log('Connected to the server');

  socket.on('alertMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $('#messages').append(li);
  });

  socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $('#messages').append(li);
  });

  socket.on('newLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = $('<li></li>');
    let a = $('<a target="_black">My location</a>');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', `${message.text}`);
    li.append(a);
    $('#messages').append(li);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  $('#message-form').on('submit', (event) => {
    event.preventDefault();
    let messageTextBox = $('[name=message]');
    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, () => {
      messageTextBox.val('');
    });
  })

  let locationButton = $('#send-location');
  locationButton.on('click', (event) => {
    event.preventDefault();
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('createLocationMessage', {
        from: 'User',
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }, () => {
        locationButton.removeAttr('disabled').text('Send location');
      });
    }, () => {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location');
    })
  });
});