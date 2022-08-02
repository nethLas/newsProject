const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/uploadPhoto')('user');
// const upload = require('../utils/CreateUploader');

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
const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};

exports.uploadUserPhoto = upload.single('photo');
exports.upadteMe = catchAsync(async (req, res, next) => {
  //1)Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Update user doc
  const filteredBody = filterObj(req.body, 'name');
  if (req.file) {
    filteredBody.profilePhoto = req.file.key;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }).populate('stories'); //very hacky

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
