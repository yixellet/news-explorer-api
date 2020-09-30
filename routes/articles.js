const router = require('express').Router();
const {
  getArticles, deleteArticle, createArticle,
} = require('../controllers/articles');
const {
  validateId, validateArticleBody,
} = require('../middlewares/validation');

router.get('/', getArticles);
router.delete('/:articleId', validateId, deleteArticle);
router.post('/', validateArticleBody, createArticle);

module.exports = router;
