const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    authController.protect,
    commentController.setStoryUserIds,
    commentController.createComment
  );
router
  .route('/:id')
  .get(commentController.getComment)
  .delete(
    authController.protect,
    commentController.isOwner,
    commentController.deleteComment
  )
  .patch(
    authController.protect,
    commentController.isOwner,
    commentController.updateComment
  );

module.exports = router;
