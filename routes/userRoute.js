const express = require('express');
const userSignup = require('../controller/usercontroller/signup');
const userLogin = require('../controller/usercontroller/login');

const router = express.Router();

router.post('/signup', userSignup)

router.post('/login', userLogin)

module.exports = router;