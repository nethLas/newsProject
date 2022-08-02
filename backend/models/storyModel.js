const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
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
storySchema.index({ slug: 1 });
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
  //cost about 100ms
  this.populate({
    path: 'author',
    select: 'name profilePhoto',
  });
  next();
});
// storySchema.post(/^find/, function () {

// });
const Story = mongoose.model('Story', storySchema);
module.exports = Story;
