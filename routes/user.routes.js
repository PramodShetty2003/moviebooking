const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST: Sign up a new user
router.post('/auth/signup', userController.signUp);

module.exports = router;