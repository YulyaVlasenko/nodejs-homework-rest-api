const usersRepository = require('../models/users')
const bcrypt = require('bcrypt');
const createError = require('../utils/createError');
const ERROR_TYPES = require('../constants/errors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'super secret';

const register = async (data) => {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await usersRepository.create({ ...data, password: passwordHash })
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

module.exports = {register, login, findById, updateSubscription}