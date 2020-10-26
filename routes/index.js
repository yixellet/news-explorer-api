const router = require('express').Router();
const {
  validateSignin, validateSignup,
} = require('../middlewares/validation');

const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { errorMessages } = require('../messages/messages');
console.log('signin');
router.post('/signin', validateSignin, login);
console.log('signup');
router.post('/signup', validateSignup, createUser);
console.log('auth');
router.use(auth);
console.log('users');
router.use('/users', userRouter);
router.use('/articles', articleRouter);
router.use((req, res) => {
  res.status(404).send({ message: errorMessages.pageNotFound });
});

module.exports = router;
