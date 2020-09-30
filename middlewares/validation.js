const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { errorMessages } = require('../messages/messages');

const validateId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex(),
  }).unknown(true),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'any.required': errorMessages.required,
        'string.email': errorMessages.email,
      }),
    password: Joi.string().required().pattern(new RegExp('[A-Za-z0-9]{8,}'))
      .messages({
        'any.required': errorMessages.required,
      }),
  }).unknown(true),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': errorMessages.required,
        'string.min': errorMessages.minLength,
        'string.max': errorMessages.maxLength,
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': errorMessages.required,
        'string.email': errorMessages.email,
      }),
    password: Joi.string().required().pattern(new RegExp('[A-Za-z0-9]{8,}'))
      .messages({
        'any.required': errorMessages.required,
      }),
  }).unknown(true),
});

const validateArticleBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required()
      .messages({
        'any.required': errorMessages.required,
      }),
    title: Joi.string().required()
      .messages({
        'any.required': errorMessages.required,
      }),
    text: Joi.string().required()
      .messages({
        'any.required': errorMessages.required,
      }),
    date: Joi.string().required()
      .messages({
        'any.required': errorMessages.required,
      }),
    source: Joi.string().required()
      .messages({
        'any.required': errorMessages.required,
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(errorMessages.link);
    })
      .messages({
        'any.required': errorMessages.required,
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(errorMessages.link);
    })
      .messages({
        'any.required': errorMessages.required,
      }),
  }).unknown(true),
});

module.exports = {
  validateSignin,
  validateSignup,
  validateId,
  validateArticleBody,
};
