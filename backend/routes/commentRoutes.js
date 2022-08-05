const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(commentController.getAllComments)
  .post(commentController.setStoryUserIds, commentController.createComment);
router
  .route('/:id')
  .get(commentController.getComment)
  .delete(commentController.isOwner, commentController.deleteComment)
  .patch(commentController.isOwner, commentController.updateComment);

module.exports = router;
