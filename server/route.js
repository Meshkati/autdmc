const express = require('express');
const router = express.Router();
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');

router.use('/login', loginRoute);
router.use('/signup', signupRoute);

module.exports = router;
