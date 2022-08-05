const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    reviewController.setStoryUserIds,
    reviewController.checkNotSelf,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.isOwner, reviewController.deleteReview)
  .patch(reviewController.isOwner, reviewController.updateReview);

module.exports = router;
