const Comment = require('../models/commentModel');
const factory = require('./handlerFactory');

exports.setStoryUserIds = (req, res, next) => {
  if (!req.body.story) req.body.story = req.params.storyId;
  req.body.user = req.user.id;
  next();
};
exports.createComment = factory.createOne(Comment);
exports.getAllComments = factory.getAll(Comment, {
  paramName: 'storyId', //the name in the query string
  foreignField: 'story', //the field in Comments that holds a tour
});

// });
exports.updateComment = factory.updateOne(Comment, ['comment']);
exports.deleteComment = factory.deleteOne(Comment);
exports.getComment = factory.getOne(Comment);
exports.isOwner = factory.isOwner(Comment, 'user');
