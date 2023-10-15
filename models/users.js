const ERROR_TYPES = require('../constants/errors');
const createError = require('../utils/createError');
const UserModel = require('./userSchema')

const create = async (data) => {
  const user = new UserModel(data);
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

module.exports = {create, findUserByEmail, findById, updateStatusSubscription}