const expect = require('expect');
const {
  generateMessage
} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let message = generateMessage('Sherin', 'Hello World');
    expect(message.from).toBe('Sherin');
    expect(message.text).toBe("Hello World");
    expect(message.createdAt).toBeA('number');
  });
});