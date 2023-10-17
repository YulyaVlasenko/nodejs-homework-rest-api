const ERROR_TYPES = require('../constants/errors');
const createError = require('../utils/createError');
const UserModel = require('./userSchema');
const path = require('path');
const fs = require('fs/promises');
const resizeAvatar = require("../utils/resizeAvatar");
// const Jimp = require("jimp");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const create = async (body) => {
  const user = new UserModel(body);
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  const [user] = await UserModel.find({ email })
  return user;
};

const findById = async (id) => {
  const user = await UserModel.findById(id, { password: 0 })
  return user;
};


const updateStatusSubscription = async (userId, body) => {


  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        subscription: body.subscription,
      },
    },
    { new: true }
  );



  if (!updatedUser) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  };

  return updatedUser;
};


const updateAvatar = async ({ tempUpload, filename }, userId) => {
  await resizeAvatar(tempUpload);
  // const filename = `${userId}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  console.log('resultUpload :>> ', resultUpload);
  await fs.rename(tempUpload, resultUpload);
  console.log('tempUpload :>> ', tempUpload);
  const avatarURL = path.join('avatars', filename);
  console.log('avatarURL :>> ', avatarURL);
//  const image = await Jimp.read(resultUpload);
//   const newWidth = image.getWidth();
//   const newHeight = image.getHeight();
//   console.log(`Новий розмір: ${newWidth}x${newHeight}`);
//   console.log(`Новий розмір: ${newWidth}x${newHeight}`);
  const updatedAvatar = await UserModel.findByIdAndUpdate(userId, { avatarURL });
  if (!updatedAvatar) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  };
  return updatedAvatar
}

module.exports = {create, findUserByEmail, findById, updateStatusSubscription, updateAvatar}
