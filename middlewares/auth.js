const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const MustAuthorizeError = require('../errors/must-authorize-error');
const { errorMessages } = require('../messages/messages');

module.exports = (req, res, next) => {
  console.log('im in auth middleware');
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new MustAuthorizeError(errorMessages.mustAuthorize);
    next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    const err = new MustAuthorizeError(errorMessages.mustAuthorize);
    next(err);
  }
  req.user = payload;
  next();
};
