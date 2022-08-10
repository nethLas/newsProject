const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const storyRouter = require('./routes/storyRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const commentRouter = require('./routes/commentRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//GLOBAL MIDDLEWARES
//Implement CORS
app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  })
);
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);
//Data sanitization against noSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
app.use(cookieParser());
app.use(compression());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/comments', commentRouter);

if (process.env.NODE_ENV === 'production') {
  //set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to the open source news api');
  });
}

app.all('*', (req, res, next) => {
  res.status(400).send(`can't find ${req.originalUrl}`);
});
app.use(globalErrorHandler);
module.exports = app;
