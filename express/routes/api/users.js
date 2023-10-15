const express = require('express');
const usersService = require('../../../services/users');
const registrationSchema = require('../../../schemas/users/registrationSchema');
const validateBody = require('../../middlewares/validateBody');
const UserModel = require('../../../models/userSchema');
const createError = require('../../../utils/createError');
const ERROR_TYPES = require('../../../constants/errors');
const auth = require('../../middlewares/auth');
const authMiddleware = require('../../middlewares/authToken');
const updateFieldSubscription = require('../../../schemas/users/updateFieldSubscription');


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
      return res.status(201).json({
        user: user,
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
    return res.status(200).json({ token: user.token, user: {email: user.email, subscription: user.subscription}});
  } catch (err) {
    next(err);
  }
});

router.post('/logout', auth, async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.findByIdAndUpdate(userId, { $set: { token: null } });
    
    if (!user) {
      const error = createError(ERROR_TYPES.UNAUTHORIZED, {
        message: 'Not authorized'
      });
      return next(error); 
    }

    res.status(204).end(); 
  } catch (err) {
    next(err);
  }
});


router.get('/current', auth, authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const user = await UserModel.findById(userId);

    if (!user) {
      const error = createError(ERROR_TYPES.UNAUTHORIZED, {
        message: 'User not found'
      });
      return next(error); 
    }

    const userData = {
      email: user.email,
      subscription: user.subscription
    };

    res.status(200).json(userData);
  } catch (err) {
    next(err)
  }
});

router.patch('/subscription', auth, authMiddleware, validateBody(updateFieldSubscription), async (req, res, next) => {
  const  userId  = req.user.sub;
  const  {body}  = req;
  try {
    const updatedUser = await usersService.updateSubscription(userId, body);
    console.log('rout :>> ', updatedUser);
  res.status(200).json(updatedUser)
  }catch (err) {
            next(err);
        }
});




module.exports = router;