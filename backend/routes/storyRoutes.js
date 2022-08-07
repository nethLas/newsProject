const express = require('express');

const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');
const commentRouter = require('./commentRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:storyId/reviews', reviewRouter);
router.use('/:storyId/comments', commentRouter);

router.route('/distances/:latlng/unit/:unit').get(storyController.getDistances);

router
  .route('/')
  .post(
    authController.protect,
    storyController.uploadStoryImages,
    storyController.setBody,
    storyController.createStory
  )
  .get(storyController.getAllStories);

router
  .route('/:id')
  .get(storyController.getStory)
  .delete(
    authController.protect,
    storyController.isOwner,
    storyController.deleteStory
  )
  .patch(
    authController.protect,
    storyController.isOwner,
    storyController.uploadStoryImages,
    storyController.setBody,
    storyController.updateStory
  );
module.exports = router;
