const usersRepository = require('../models/users')


const register = async (body) => {
  const user = await usersRepository.create(body);
  return user;
};

const login = async (body) => {
  const user = await usersRepository.login(body);
  return user;
};

const logout = async (userId) => {
  const user = await usersRepository.logout(userId);
  return user;
};

const getCurrentUserByToken = async (userId) => {
  const user = await usersRepository.getCurrentUserByToken(userId);
  return user;
};

const findUserForStrategy = async (id) => {
  const user = await usersRepository.findUserForStrategy(id);
  return user;
};

const updateSubscription = async (userId, body) => {
  const updatedUser = await usersRepository.updateStatusSubscription(userId, body)
  return updatedUser;
};

const updateAvatar = async ({ tempUpload, originalname }, userId) => {
  const updatedAvatar = await usersRepository.updateAvatar({ tempUpload, originalname }, userId);
  return updatedAvatar;
};

const verifyEmail = async (verificationToken) => {
  await usersRepository.verifyEmail(verificationToken);
};

const verifyResend = async (email) => {
   await usersRepository.verifyResend(email);
}

module.exports = {
  register, login, logout, getCurrentUserByToken,
  findUserForStrategy, updateSubscription, updateAvatar,
  verifyEmail, verifyResend
};