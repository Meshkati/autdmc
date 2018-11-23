const express = require('express');
const router = express.Router();
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');
const teamRoute = require('./routes/team');

router.use('/login', loginRoute);
router.use('/signup', signupRoute);
router.use('/teams', teamRoute);

module.exports = router;
