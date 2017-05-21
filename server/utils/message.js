const moment = require('moment');

let generateMessage = (from, text) => {
  let message = {};
  message.from = from;
  message.text = text;
  message.createdAt = moment().valueOf();
  return message;
};

let generateLocationMessage = (position) => {
  let message = {};
  message.from = position.from;
  message.text = `https://maps.google.com?q=${position.lat},${position.lng}`;
  message.createdAt = moment().valueOf();
  return message;
}

module.exports = {
  generateMessage,
  generateLocationMessage
};