const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

//sign token to be sent
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
//create and send the token via cookie
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };
  res.cookie('jwt', token, cookieOptions);
  //Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); very bad
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log('created user');
  req.user = newUser;
  //send activation email
  // this.sendActivateToken();//FIX ME
  // createSendToken(newUser, 201, req, res);
  next();
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please Provide Email and password', 400));
  }
  //2)check if user exists and passowrd correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorect password or email', 401));
  }
  //3)send token
  createSendToken(user, 200, req, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  //1)get token
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('you are not logged please log in to get access', 401)
    );
  }
  //2)validate/verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3)Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  //4) user changed password after jwt was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password! please log in again.', 401)
    );
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

//helper for checkuser
const sendUser = (req, res, user) => {
  res.status(200).json({ status: 'success', data: { user } });
};

exports.checkUser = async (req, res, next) => {
  if (!req.cookies.jwt) return sendUser(req, res, null);
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return sendUser(req, res, null);
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return sendUser(req, res, null);
    }
    //there is a user
    return sendUser(req, res, currentUser);
  } catch (error) {
    return sendUser(req, res, null);
  }
};
//Update pass while logged in
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2)check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('NO', 401));
  //3)if so , update password,
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4)log user in with new password
  createSendToken(user, 200, req, res);
});
//update pass while logged out or you forgot your password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email address.', 404));
  //2)generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateModifiedOnly: true });
  //3)send it to users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();
    res
      .status(200)
      .json({ status: 'success', message: 'Token sent to email!' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateModifiedOnly: true });
    return next(new AppError('There was an error sending the email', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) If token has not expired and there is a user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
  //2.1) if password is the same throw error
  if (await user.correctPassword(req.body.password, user.password))
    return next(
      new AppError('New password must be different from old password', 401)
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3)Update changed passwordAt property for user
  //done in user model
  //4)log the user in, send JWT
  createSendToken(user, 200, req, res);
});
//activating user
exports.sendActivateToken = catchAsync(async (req, res, next) => {
  //1)get user based on POSTed email
  const user = req.user || (await User.findOne({ email: req.body.email }));
  if (!user)
    return next(new AppError('There is no user with that email address.', 404));
  if (user.verfied) return next(new AppError('User Already verified', 400));
  //2)generate token
  const activationToken = user.createActivationToken();
  await user.save({ validateModifiedOnly: true });
  //3)send it to users email
  const activationUrl = `${req.protocol}://${req.get(
    'host'
  )}/activate-user/${activationToken}`;
  try {
    await new Email(user, activationUrl).sendUserActivation();
    res
      .status(200)
      .json({ status: 'success', message: 'Token sent to email!' });
  } catch (error) {
    console.log(error);
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save({ validateModifiedOnly: true });
    return next(new AppError('There was an error sending the email', 500));
  }
});
exports.activateAccount = catchAsync(async (req, res, next) => {
  //1)get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(hashedToken);
  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpires: { $gt: Date.now() },
  });
  //2) If token has not expired and there is a user, activate the user
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
  //2.1) if password is the same throw error
  user.verfied = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;
  await user.save({ validateModifiedOnly: true });
  //4)log the user in, send JWT
  createSendToken(user, 200, req, res);
});
