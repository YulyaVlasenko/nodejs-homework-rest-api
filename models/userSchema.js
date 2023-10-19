const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
   avatarURL: {
    type: String,
    required: true,
  },
  token: {
     type: String,
   }
},
   { versionKey: false },
);


userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj._id;
  delete obj.token;
  return obj;
};

const UserModel = model('users', userSchema);

module.exports = UserModel;