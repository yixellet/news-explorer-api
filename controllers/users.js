const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = require('../secretKey');
const NotFoundError = require('../errors/not-found-error');

function createUserError(req, res, err) {
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Пользователь с таким Email уже существует' });
  }
  return res.status(500).send({ message: err.message });
}

function passwordValidation(password) {
  const regex = /[A-Za-z0-9]{8,}/;
  return regex.test(password);
}

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.cookies.myId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundError('Пользователя с таким ID не существует');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    name, email,
  } = req.body;
  if (passwordValidation(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name, email, password: hash,
      }))
      .then((user) => res.send({
        id: user._id, email: user.email,
      }))
      .catch((err) => createUserError(req, res, err));
  } else {
    res.status(400).send({ message: 'Пароль должен содержать не менее 8 символов и состоять из цифр и латинских букв' });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey.secretKey, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
      res.cookie('myId', user._id)
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
