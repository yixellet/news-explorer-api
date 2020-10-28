const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const CantDeleteError = require('../errors/cant-delete-error');
const ServerError = require('../errors/server-error');
const InvalidIdError = require('../errors/invalid-id-error');
const { errorMessages } = require('../messages/messages');

module.exports.getArticles = (req, res, next) => {
  Article.find({owner: req.user._id})
    .then((articles) => res.send({ data: articles }))
    .catch(next);
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
    .catch(next);
};

module.exports.deleteArticle = (req, res) => {
  Article.findById(req.params.articleId)
    .orFail(() => {
      throw new NotFoundError(errorMessages.articleNotFound);
    })
    .then((article) => {
      if (String(article.owner) === String(req.user._id)) {
        Article.deleteOne(article)
          .then(() => res.send({ data: article }));
      } else {
        throw new CantDeleteError(errorMessages.cannotDelete);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidIdError(errorMessages.invalidArticleId);
      } else if (err.statusCode === 500) {
        throw new ServerError(errorMessages.serverError);
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};
