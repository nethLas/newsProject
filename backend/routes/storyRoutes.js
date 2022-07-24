const express = require('express');

const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').post(
  (req, res, next) => {
    // console.log(req.body);
    next();
  },
  authController.protect,
  storyController.uploadStoryImages,
  storyController.setBody,
  // storyController.setUserId,
  storyController.createStory
);
router.route('/:id').get(storyController.getStory);
module.exports = router;
