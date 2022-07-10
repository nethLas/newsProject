const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
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
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});
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
const User = mongoose.model('user', userSchema);
module.exports = User;
