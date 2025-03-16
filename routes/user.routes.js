const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST: Sign up a new user
router.post('/auth/signup', userController.signUp);
// POST: Log in a user
router.post('/auth/login', userController.login);
// POST: Logout the user
router.post('/auth/logout', userController.logout);

module.exports = router;