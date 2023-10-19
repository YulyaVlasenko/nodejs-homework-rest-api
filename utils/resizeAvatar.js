const Jimp = require("jimp");

const resizeAvatar = async (avatar) =>
  (await Jimp.read(avatar)).resize(250, 250).write(avatar);

module.exports = resizeAvatar;