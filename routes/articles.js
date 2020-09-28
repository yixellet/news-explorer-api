const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getArticles, deleteArticle, createArticle,
} = require('../controllers/articles');

router.get('/', getArticles);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }).unknown(true),
}), deleteArticle);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().greater('now'),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(new RegExp('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')),
    image: Joi.string().required().pattern(new RegExp('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')),
  }).unknown(true),
}), createArticle);

module.exports = router;
