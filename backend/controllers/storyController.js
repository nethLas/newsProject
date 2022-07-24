const Story = require('../models/storyModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/uploadPhoto')('story-img');
const factory = require('./handlerFactory');

exports.uploadStoryImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
exports.setBody = (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  if (req.files?.imageCover) req.body.imageCover = req.files.imageCover[0].key;
  if (req.files?.images)
    req.body.images = req.files.images.map((img) => img.key);
  req.body.author = req.user._id.toString();
  next();
};
// exports.setUserId = (req, res, next) => {
//   next();
// };
exports.createStory = factory.createOne(Story);
exports.getStory = factory.getOne(Story);
