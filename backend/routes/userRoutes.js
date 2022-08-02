const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const storyRouter = require('./storyRoutes');

const router = express.Router();

router.use('/:userId/stories', storyRouter);
router.post('/signup', authController.signup, authController.sendActivateToken);
router.route('/login').post(authController.login).get(authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/activateAccount', authController.sendActivateToken);
router.patch('/activateAccount/:token', authController.activateAccount);

router.get('/check-user', authController.checkUser);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.upadteMe
);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
module.exports = router;
