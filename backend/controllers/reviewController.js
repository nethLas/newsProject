const Review = require('../models/reviewModel');
const Story = require('../models/storyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setStoryUserIds = (req, res, next) => {
  if (!req.body.story) req.body.story = req.params.storyId;
  req.body.user = req.user.id;
  next();
};
exports.checkNotSelf = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.body.story);
  if (story.author.id === req.user.id) {
    return next(new AppError("Can't rate your own story", 403));
  }
  next();
});
exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review, {
  paramName: 'storyId', //the name in the query string
  foreignField: 'story', //the field in reviews that holds a tour
});

// });
exports.updateReview = factory.updateOne(Review, ['rating']);
exports.deleteReview = factory.deleteOne(Review);
exports.getReview = factory.getOne(Review);
exports.isOwner = factory.isOwner(Review, 'user');
