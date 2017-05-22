const socket = io();

let scrollToBottom = () => {
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child');
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  let params = $.deparam(window.location.search);
  socket.emit('join', params, (err) => {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('no error');
    }
  });
  console.log('Connected to the server');

  socket.on('updateUsersList', (users) => {
    let ol = $('<ol></ol');
    users.forEach((user) => {
      ol.append($('<li></li>').text(user));
      $('#users').html(ol);
    });
  });

  socket.on('alertMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
  });

  socket.on('leftMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
  })

  socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
  });

  socket.on('newLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
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