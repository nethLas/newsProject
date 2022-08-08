const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Review = require('./reviewModel');
const Comment = require('./commentModel');
const getPreSignedUrl = require('../utils/getPreSignedUrl');

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A story must have a title'],
      unique: true,
      trim: true,
      maxlength: [125, 'A story title must have less than 125 characters'],
      minlength: [10, 'A story title must have more than 10 characters'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Story must belong to a user'],
    },
    text: {
      type: String,
      required: [true, 'A story must contain text'],
      trim: true,
      maxlength: [3500, 'A story title must have less than 3500 characters'],
      minlength: [100, 'A story title must have more than 100 characters'],
    },
    summary: {
      type: String,
      trim: true,
      // maxlength: [250, 'A story summary must have less than 250 characters'],
    },
    slug: String,
    imageCover: {
      type: String,
      // required: [true, 'A story must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    ratingsAverage: {
      type: Number,
      // default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    sources: [
      {
        type: String,
        validate: [validator.isURL, 'Please provide a valid link'],
      },
    ],
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
storySchema.index({ title: 'text', text: 'text' });
storySchema.index({ slug: 1 });
//added location index in mongo
storySchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
storySchema.virtual('imageCoverUrl').get(function () {
  return this.imageCover ? getPreSignedUrl(this.imageCover) : undefined;
});
storySchema.virtual('imageUrls').get(function () {
  return this.images?.length
    ? this.images.map((img) => getPreSignedUrl(img))
    : undefined;
});
storySchema.pre(/^find/, function (next) {
  //might change this
  //cost about 100ms
  this.populate({
    path: 'author',
    select: 'name profilePhoto',
  });
  next();
});
// eslint-disable-next-line prefer-arrow-callback
storySchema.post('findOneAndDelete', async function (doc) {
  await Promise.all([
    Comment.deleteMany({ story: doc.id }).exec(),
    Review.deleteMany({ story: doc.id }).exec(),
  ]);
  // next();
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
