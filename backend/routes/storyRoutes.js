const express = require('express');

const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    storyController.uploadStoryImages,
    storyController.setBody,
    storyController.createStory
  )
  .get(storyController.getAllStories);
router.route('/:id').get(storyController.getStory);
module.exports = router;
