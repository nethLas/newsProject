const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getUser = catchAsync(async (req, res, next) => {
  const query = User.findById(req.params.id);
  const doc = await query;
  if (!doc) {
    return next(new AppError('No document found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: doc,
    },
  });
});
