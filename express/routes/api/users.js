const express = require('express');
const usersService = require('../../../services/users');
const registrationSchema = require('../../../schemas/users/registrationSchema');
const validateBody = require('../../middlewares/validateBody');
const createError = require('../../../utils/createError');
const ERROR_TYPES = require('../../../constants/errors');
const auth = require('../../middlewares/auth');
const authMiddleware = require('../../middlewares/authToken');
const updateFieldSubscription = require('../../../schemas/users/updateFieldSubscription');
const upload = require('../../middlewares/multer');



const router = express.Router()


router.post('/register', validateBody(registrationSchema),async (req, res, next) => {
  const { body } = req;
  try {
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
    await usersService.logout(userId);
    res.status(204).end(); 
  } catch (err) {
    next(err);
  }
});


router.get('/current', auth, authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.sub;

    const user = await usersService.getCurrentUserByToken(userId);
    res.status(200).json(user);
  } catch (err) {
    next(err)
  }
});

router.patch('/subscription', auth, authMiddleware,validateBody(updateFieldSubscription), async (req, res, next) => {
  const  userId  = req.user.sub;
  const  {body}  = req;
  try {
    const updatedUser = await usersService.updateSubscription(userId, body);
  res.status(200).json(updatedUser)
  }catch (err) {
            next(err);
        }
});

router.patch('/avatars', auth, upload.single('avatar'), async (req, res, next) => {
  if (!req.file) {
    const error = createError(ERROR_TYPES.NOT_FOUND, {
      message: "Download File Not Found",
    });
    return next(error);
  };
  const { path: tempUpload, originalname } = req.file;
  const userId = req.user._id
  
  try {
    const updatedAvatar = await usersService.updateAvatar({ tempUpload, originalname }, userId);
  res.status(200).json({avatarURL: updatedAvatar.avatarURL})
  }catch (err) {
            next(err);
        }
});




module.exports = router;