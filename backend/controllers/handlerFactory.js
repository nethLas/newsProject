const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// const getCollectionName = (Model) => Model.collection.collectionName;
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // try {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
        // data: { [getCollectionName(Model)]: docs },
      },
    });
  });
const getFilterObj = ({ paramName, foreignField }, req) => {
  const paramValue = req.params?.[paramName];
  return paramValue ? { [foreignField]: paramValue } : {};
};
exports.getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    let filterObj = {};
    if (typeof options === 'object' && Object.keys(options).length) {
      filterObj = getFilterObj(options, req);
    }

    const apiFeatures = new APIFeatures(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await apiFeatures.query.exec();

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs },
    });
  });
