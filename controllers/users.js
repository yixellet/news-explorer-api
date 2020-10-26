const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');
const InvalidIdError = require('../errors/invalid-id-error');
const UserExistsError = require('../errors/user-exists-error');
const { errorMessages } = require('../messages/messages');

function createUserError(req, res, err) {
  if (err.code === 11000) {
    throw new UserExistsError(errorMessages.userExists);
  }
}

function passwordValidation(password) {
  const regex = /[A-Za-z0-9]{8,}/;
  return regex.test(password);
}

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(errorMessages.userNotFound);
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidIdError(errorMessages.invalidUserId);
      } else if (err.statusCode === 500) {
        throw new ServerError(errorMessages.serverError);
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  console.log('im in signup handler');
  const {
    name, email,
  } = req.body;
  if (passwordValidation(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name, email, password: hash,
      }))
      .then((user) => res.status(201).send({
        id: user._id, email: user.email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          res.status(409).send({ message: errorMessages.userExists});
        }
      });
  } else {
    res.status(400).send({ message: errorMessages.passwordError });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).send({ jwt: token })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
