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
//create and send the token via cookie //when user gets a token
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
//when user doesnt get a token
const sendUser = (user, statusCode, req, res) => {
  res.status(statusCode).json({ status: 'success', data: { user } });
};
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); very bad
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //send activation email
  // this.sendActivateToken();//FIX ME
  // createSendToken(newUser, 201, req, res);
  newUser.password = undefined;
  sendUser(newUser, 201, req, res);
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
    //super expensive
    return next(new AppError('Incorect password or email', 401));
  }
  if (!user.verified) {
    this.sendActivateToken(req, res, next);
    return next(
      new AppError(
        'You are not verified, we are sending you a verificaton email',
        401
      )
    );
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
  //4)Check if user is verified
  if (!currentUser.verified)
    return next(
      new AppError('User must be verified in order to perform this action', 401)
    );
  //5) user changed password after jwt was issued
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

exports.checkUser = async (req, res, next) => {
  if (!req.cookies.jwt) return sendUser(null, 200, req, res);
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id).populate('stories');
    if (!currentUser) return sendUser(null, 200, req, res);

    // 3) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
      return sendUser(null, 200, req, res);

    if (!currentUser.verified) return sendUser(null, 200, req, res);
    //there is a user
    //this is how to populate on doc and not query
    return sendUser(currentUser, 200, req, res);
  } catch (error) {
    return sendUser(null, 200, req, res);
  }
};
//Update pass while logged in
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2)check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('No', 401));
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
    console.log(error);
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
  }).select('+password');

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
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email address.', 404));
  if (user.verified) return next(new AppError('User Already verified', 400));
  //2)generate token
  const activationToken = user.createActivationToken();

  await user.save({ validateModifiedOnly: true });
  //3)send it to users email
  const activationUrl = `${req.protocol}://${req.get(
    'host'
  )}/activate-user/${activationToken}`;
  try {
    await new Email(user, activationUrl).sendUserActivation();
    if (!res.headersSent)
      //Only send in case headers were not sent
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
  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpires: { $gt: Date.now() },
  });
  //2) If token has not expired and there is a user, activate the user
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
  user.verified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;
  await user.save({ validateModifiedOnly: true });
  //4)log the user in, send JWT
  createSendToken(user, 200, req, res);
});
