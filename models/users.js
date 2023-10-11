const UserModel = require('./userSchema')

const create = async (data) => {
  const user = new UserModel(data);
  await user.save();
  console.log(user)
  return user;
};

const findUserByEmail = async (email) => {
  const [user] = await UserModel.find({ email })
  console.log(user)
  return user;
};

const findById = async (id) => {
  const user = await UserModel.findById(id, { password: 0 })
  return user;
};

module.exports = {create, findUserByEmail, findById}