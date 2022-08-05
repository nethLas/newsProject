const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment can not be empty'],
      max: [250, 'Comment cannot be longer than 250 characters'],
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
commentSchema.index({ story: 1, user: 1 });
commentSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
