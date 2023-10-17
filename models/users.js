const ERROR_TYPES = require('../constants/errors');
const createError = require('../utils/createError');
const UserModel = require('./userSchema');
const path = require('path');
const fs = require('fs/promises');
const resizeAvatar = require("../utils/resizeAvatar");
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

const addTokenToSchema = async (userId, token) => {
  await UserModel.findByIdAndUpdate(userId, {token})
}


const updateAvatar = async ({ tempUpload, filename }, userId) => {
  await resizeAvatar(tempUpload);
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join('avatars', filename);
  const updatedAvatar = await UserModel.findByIdAndUpdate(userId, { avatarURL });
  if (!updatedAvatar) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Not found",
    });
    throw error;
  };
  return updatedAvatar
}

module.exports = {create, findUserByEmail, findById, updateStatusSubscription, updateAvatar, addTokenToSchema}
