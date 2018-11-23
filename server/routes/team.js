const express = require('express');
const asyncMiddleware = require('../middlewares/async');
const teamCollection = require('../db/team');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
    let teams = await teamCollection.getAllTeams();
    res.json(teams);
}));
module.exports = router;
