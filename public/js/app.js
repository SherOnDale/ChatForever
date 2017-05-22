const socket = io();

let scrollToBottom = () => {
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child');
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  let params = $.deparam(window.location.search);
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {}
  });

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

  $('#message-form').on('submit', (event) => {
    event.preventDefault();
    let messageTextBox = $('[name=message]');
    socket.emit('createMessage', {
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

  let statusText = $('.chat__status-p');
  let messageInput = $('#message-input');
  let typing = false;
  let timeout;
  var typingDelay = 1000;

  messageInput.keyup(() => {
    if (!typing)
      socket.emit('typing', true);
    typing = true;
    clearTimeout(timeout);
    timeout = setTimeout(clearTypingStatus, 1000);
  });

  let clearTypingStatus = () => {
    typing = false;
    socket.emit('typing', false);
  };

  socket.on('updateTypingStatus', message => {
    if(message.status) {
      statusText.html(`${message.name} is typing...`)
    } else {
      statusText.html('');
    }
  });
});