const Story = require('../models/storyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/uploadPhoto')('story-img');
const factory = require('./handlerFactory');

const allowefFields = [
  'locations',
  'text',
  'sources',
  'title',
  'summary',
  'imageCover',
  'images',
];
exports.uploadStoryImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
exports.setBody = (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  if (req.files?.imageCover) req.body.imageCover = req.files.imageCover[0].key;
  if (req.files?.images)
    req.body.images = req.files.images.map((img) => img.key);
  req.body.author = req.user._id.toString();
  next();
};

// exports.setUserId = (req, res, next) => {
//   next();
// };
exports.createStory = factory.createOne(Story, allowefFields);
exports.getStory = factory.getOne(Story);
exports.getAllStories = factory.getAll(Story, {
  paramName: 'userId', //the name in the query string
  foreignField: 'author', //the field in story that holds a user
});
exports.isOwner = factory.isOwner(Story, 'author');
exports.deleteStory = factory.deleteOne(Story);
exports.updateStory = factory.updateOne(Story, allowefFields);

exports.getDistances = catchAsync(async (req, res, next) => {
  const getLastWeekDate = () => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14); //for the moment two weeks bcoz no t big db
  };
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng)
    return next(
      new AppError(
        'Please provide latitude and longitude in format lat,lng.',
        400
      )
    );
  /*$geoNear requires a geospatial index.
    If you have more than one geospatial index on the collection, use the keys parameter to
    specify which field to use in the calculation. If you have only one geospatial index
    , $geoNear implicitly uses the indexed field for the calculation. */
  let distances = await Story.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        includeLocs: 'locationUsed',
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $match: {
        createdAt: {
          $gte: getLastWeekDate(),
        },
      },
    },
    {
      $limit: 10,
    },
  ]);
  distances = distances.map((doc) => Story.hydrate(doc)); //to get populates
  const docs = await Story.populate(distances, {
    path: 'author',
    select: 'name profilePhoto',
  });
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { data: docs },
  });
});
