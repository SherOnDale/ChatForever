let isValidParam = (obj) => {
   return typeof obj.name == 'string' && typeof obj.room == 'string' && obj.name.trim().length > 0 && obj.room.trim().length > 0;
};

module.exports = {
  isValidParam
}