const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST: Sign up a new user
router.post('/auth/signup', userController.signUp);
// POST: Log in a user
router.post('/auth/login', userController.login);
// POST: Logout the user
router.post('/auth/logout', userController.logout);
//GET: get the coupon
router.get('/auth/coupons',userController.getCouponCode);
//POST: to book the show
router.post('/auth/bookings',userController.bookShow);

module.exports = router;