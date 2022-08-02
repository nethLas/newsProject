const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.isOwner = (Model, idField) =>
  catchAsync(async (req, _, next) => {
    const doc = await Model.findById(req.params.id).exec(); //exec is to get a "better" stack trace;

    if (req.user.id !== doc[idField].id && req.user.role !== 'admin') {
      //check if user owns resource or if user is admin in which case he can also acces it
      next(new AppError('Unauthorized', 403));
      return;
    }

    next();
  });
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
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
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
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
