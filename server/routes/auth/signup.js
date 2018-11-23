const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async');
const bodyValidationMiddleware = require('../../middlewares/validation').bodyValidation;
const validationSchema = require('../../validations/signup-teams').signupSchema;
const teamCollection = require('../../db/team');

const bcrypt = require('bcrypt');
const generatePassword = require('../../util/passwd-gen').generatePassword;

router.get('/', (req, res) => {
    res.json({b: 13})
});

router.post('/', bodyValidationMiddleware(validationSchema), asyncMiddleware( async (req, res) => {
    let team = req.body;
    let password = generatePassword(10);
    console.log('Password :', password);
    team.password = await bcrypt.hash(password, 10);
    let result = await teamCollection.newTeam(team);
    res.json({result: result});
}));
module.exports = router;
