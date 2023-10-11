const ERROR_TYPES = require("../../constants/errors");
const createError = require("../../utils/createError");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = createError(ERROR_TYPES.UNAUTHORIZED, {
      message: "Not authorized"
    });
    return next(error);
  }

  // Розбираємо токен
  const token = authHeader.split(' ')[1];

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    //   console.log(decoded)
    next();
  } catch (error) {
    const err = createError(ERROR_TYPES.UNAUTHORIZED, {
      message: "Not authorized"
    });
    next(err);
  }
};


// const jwt = require('jsonwebtoken');
// const ERROR_TYPES = require('../../constants/errors');
// const createError = require('../../utils/createError');
// const {JWT_SECRET} = process.env

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization.split(' ')[1];
// console.log(token)
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = decoded;
//       //   console.log(decoded)
//        const err = createError(ERROR_TYPES.UNAUTHORIZED, {
//       message: "Not authorized"
//     });
//     next(err);
//   } catch (error) {
   
//     next(err);
//   }
// };

module.exports = authMiddleware;

