const ERROR_TYPES = require('../constants/errors');
const createError = require('../utils/createError');
const UserModel = require('./userSchema');
const path = require('path');
const fs = require('fs/promises');
const resizeAvatar = require("../utils/resizeAvatar");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const create = async ({email, password}) => {
    const existingUser = await UserModel.findOne({email});
    if (existingUser) {
     const error = createError(ERROR_TYPES.CONFLICT, {
      "message": "Email in use"
    })
     throw(error);
  };
  
  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url({ email })
    
  const user = new UserModel({
    email,
    password: passwordHash,
    avatarURL,
  });
  await user.save();
  return user;
};


const login = async ({ email, password }) => {
    const [user] = await UserModel.find({email});
    if (!user) {
        const error = createError(ERROR_TYPES.NOT_FOUND, {
            message: 'Email or password is wrong',
        });
        throw error;
    }

  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    const error = createError(ERROR_TYPES.UNAUTHORIZED, {
      message: 'Email or password is wrong',
    });
    throw error;
    }
    
    const serializedUser = user.toObject();
    delete serializedUser.password;

  const token = jwt.sign(
  { sub: serializedUser._id, role: serializedUser.role },
  JWT_SECRET,
  { expiresIn: 3600 },
  );

  const userId = user.id

  await UserModel.findByIdAndUpdate(userId, {token})

  return { ...serializedUser, token };

};


const logout = async (userId) => {
   const user = await UserModel.findByIdAndUpdate(userId, { $set: { token: null } });
    
    if (!user) {
      const error = createError(ERROR_TYPES.UNAUTHORIZED, {
        message: 'Not authorized'
      });
      throw(error); 
    }
}

const getCurrentUserByToken = async (userId) => {
  const user = await UserModel.findById(userId, { password: 0, avatarURL: 0 });

     if (!user) {
      const error = createError(ERROR_TYPES.UNAUTHORIZED, {
        message: 'User not found'
      });
      throw(error); 
  }
  
  return user
}

const findUserForStrategy = async (id) => {
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




const updateAvatar = async ({ tempUpload, originalname }, userId) => {
  const filename = `${userId}_${originalname}`;
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

module.exports = {create, login, logout, getCurrentUserByToken, findUserForStrategy, updateStatusSubscription, updateAvatar}
