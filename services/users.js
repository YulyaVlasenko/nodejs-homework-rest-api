const usersRepository = require('../models/users')
const bcrypt = require('bcrypt');
const createError = require('../utils/createError');
const ERROR_TYPES = require('../constants/errors');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const gravatar = require('gravatar');

const register = async ({password, email}) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url({ email })
  const user = await usersRepository.create({
    email,
    password: passwordHash,
    avatarURL,
  })

  return user;
};

const login = async ({ email, password }) => {
    const user = await usersRepository.findUserByEmail(email);
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
  await usersRepository.addTokenToSchema(userId, token)

  return { ...serializedUser, token };

};

const findById = async (id) => {
  const user = await usersRepository.findById(id);

  return user;
};

const updateSubscription = async (userId, body) => {
  const updatedUser = await usersRepository.updateStatusSubscription(userId, body)
  return updatedUser;
}

const updateAvatar = async (path, userId) => {
  const updatedAvatar = await usersRepository.updateAvatar(path, userId);
  return updatedAvatar;
}

module.exports = {
  register, login,
  findById,
  updateSubscription, updateAvatar
}