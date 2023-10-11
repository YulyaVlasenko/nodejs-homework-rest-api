const express = require('express');
const usersService = require('../../../services/users');
const registrationSchema = require('../../../schemas/users/registrationSchema');
const validateBody = require('../../middlewares/validateBody');
const UserModel = require('../../../models/userSchema');
const createError = require('../../../utils/createError');
const ERROR_TYPES = require('../../../constants/errors');


const router = express.Router()


router.post('/register', validateBody(registrationSchema),async (req, res, next) => {
  const { body } = req;

  try {
    const { email} = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
     const error = createError(ERROR_TYPES.CONFLICT, {
      "message": "Email in use"
    })
     return next(error);
    }
    
    const user = await usersService.register(body);
      if (user) {
      return res.json({
        message: 'User created successfully!',
        data: user,
      });
      }
    const error = createError(ERROR_TYPES.BAD_REQUEST, {
      "message": "User created failed!"
    })
    return error

  } catch (err) {
    next(err);
  }
});


router.post('/login', validateBody(registrationSchema),async (req, res, next) => {
  const { body } = req;
  try {
    const user = await usersService.login(body);
    return res.json({ data: user, message: 'Successfully logged in a user!' });
  } catch (err) {
    next(err);
  }
});




module.exports = router;