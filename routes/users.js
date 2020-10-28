const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo } = require('../controllers/users');

router.get('/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserInfo);

module.exports = router;
