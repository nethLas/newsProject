const mongoose = require('mongoose');
const Story = require('./storyModel');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      required: [true, 'review must contain rating'],
    },
    createdAt: { type: Date, default: Date.now() },
    story: {
      type: mongoose.Schema.ObjectId,
      ref: 'Story',
      required: [true, 'Review must belong to a Story.'],
      immutable: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ story: 1, user: 1 }, { unique: true });
reviewSchema.statics.calcAverageRatings = async function (storyId) {
  const stats = await this.aggregate([
    {
      $match: { story: storyId },
    },
    {
      $group: {
        _id: '$story',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Story.findByIdAndUpdate(storyId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    });
  } else {
    await Story.findByIdAndUpdate(storyId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.story); //this.constructor points to the model
});
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.rev = await this.clone();
//   next();
// });//THIS DOESNT MATTER BUT IS A GOOD EXAMPLE OF PASSING FIELDS BETWEEN PRE AND POST
// reviewSchema.post(/^findOneAnd/, async function () {
//   // this.rev = await this.findOne(); does not work here the query has already been executed
//   await this.rev.constructor.calcAverageRatings(this.rev.tour);
// });
reviewSchema.post(/^findOneAnd/, async (docs) => {
  docs.constructor.calcAverageRatings(docs.story);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
