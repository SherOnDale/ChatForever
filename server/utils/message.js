let generateMessage = (from, text) => {
  let message = {};
  message.from = from;
  message.text = text;
  message.createdAt = new Date().getTime();
  console.log(JSON.stringify(message, undefined, 2));
  return message;
};

module.exports = {
  generateMessage
};