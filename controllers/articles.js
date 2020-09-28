const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const CantDeleteError = require('../errors/cant-delete-error');
const ServerError = require('../errors/server-error');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ data: articles }))
    .catch(() => {
      const err = new ServerError('На сервере произошла ошибка');
      next(err);
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send({ data: article }))
    .catch(() => {
      const err = new ServerError('На сервере произошла ошибка');
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (String(article.owner) === String(req.user._id)) {
        Article.findByIdAndRemove(article._id)
          .then((articl) => {
            if (articl) {
              res.send({ data: articl });
            } else {
              throw new NotFoundError('Карточки с таким ID не существует');
            }
          })
          .catch(next);
      } else {
        throw new CantDeleteError('Удалять карточки может только их владелец');
      }
    })
    .catch(next);
};
