/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('uncaught exception shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log(`DB success`.cyan.underline));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}`.cyan.underline);
});

process.on('unhandledRejection', (err) => {
  console.log(err.stack, err.name, err.message);
  console.log('unhandled rejection shutting down');
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
