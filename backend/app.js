const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
// const upload = require('./utils/uploadPhoto');

const app = express();
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Body parser, rading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// app.post('/upload', upload.array('photos', 1), (req, res, next) => {
//   res.send(
//     `Successfully uploaded ${req.files.length} files! find me at:${req.files[0].location}`
//   );
// });
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  res.status(400).send(`can't find ${req.originalUrl}`);
});
app.use(globalErrorHandler);
module.exports = app;
