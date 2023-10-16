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


  const token = authHeader.split(' ')[1];

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    next();
  } catch (error) {
    const err = createError(ERROR_TYPES.UNAUTHORIZED, {
      message: "Not authorized"
    });
    next(err);
  }
};


module.exports = authMiddleware;

