const express = require('express');

const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

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
