const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const {JWT_SECRET} = process.env
const usersService = require('../../services/users');
const createError = require('../../utils/createError');
const ERROR_TYPES = require('../../constants/errors');


const jwtStrategy = new Strategy(
    {
    secretOrKey: JWT_SECRET,
    jwtFromRequest:
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
  async (payload, done) => {
    try {
      const user = await usersService.findUserForStrategy(payload.sub);
      if (user) {
        return done(null, user);
      } else {
        const err = createError(ERROR_TYPES.UNAUTHORIZED, {
          message: 'Unauthorized',
        });
        return done(err, null);
      }
    } catch (err) {
      return done(err, null);
    }
  },
);

passport.use(jwtStrategy);