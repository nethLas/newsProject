const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const getPreSignedUrl = require('../utils/getPreSignedUrl');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      minlength: [10, 'name must be at least 10 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Please tell us your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Plese provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          //this only works on CREATE and SAVE
          return val === this.password;
        },
        message: 'password confirm ({VALUE}) should be the same as password',
      },
    },
    profilePhoto: String,
    //password changing
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    //account avtivation
    verifyToken: String,
    verifyTokenExpires: Date,
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.virtual('profileUrl').get(function () {
  return this.profilePhoto ? getPreSignedUrl(this.profilePhoto) : undefined;
});
//DOCUMENT MIDDELWARE
userSchema.pre('save', async function (next) {
  //only run if password is modified or user is newly created
  if (!this.isModified('password')) return next();
  //hash with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  if (this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();
//   this.passwordChangedAt = Date.now();
//   next();
// });
//SCHEMA METHODS
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
    // console.log(this.passwordChangedAt, JWTTimeStamp);
  }
  return false;
};
// create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
// create activation token
userSchema.methods.createActivationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.verifyToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verifyTokenExpires = Date.now() + 30 * 60 * 1000;
  return token;
};
const User = mongoose.model('user', userSchema);
module.exports = User;
