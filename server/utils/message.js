let generateMessage = (from, text) => {
  let message = {};
  message.from = from;
  message.text = text;
  message.createdAt = new Date().getTime();
  return message;
};

let generateLocationMessage = (position) => {
  let message = {};
  message.from = position.from;
  message.text = `https://maps.google.com?q=${position.lat},${position.lng}`;
  message.createdAt = new Date().getTime();
  return message;
}

module.exports = {
  generateMessage,
  generateLocationMessage
};