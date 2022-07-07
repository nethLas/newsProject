const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.route('/login').post(authController.login).get(authController.logout);
router.get('/check-user', authController.checkUser);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

module.exports = router;
