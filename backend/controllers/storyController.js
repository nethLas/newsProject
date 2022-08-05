const Story = require('../models/storyModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/uploadPhoto')('story-img');
const factory = require('./handlerFactory');

const allowefFields = [
  'locations',
  'text',
  'sources',
  'title',
  'summary',
  'imageCover',
  'images',
];
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
exports.createStory = factory.createOne(Story, allowefFields);
exports.getStory = factory.getOne(Story);
exports.getAllStories = factory.getAll(Story, {
  paramName: 'userId', //the name in the query string
  foreignField: 'author', //the field in story that holds a user
});
exports.isOwner = factory.isOwner(Story, 'author');
exports.deleteStory = factory.deleteOne(Story);
exports.updateStory = factory.updateOne(Story, allowefFields);
