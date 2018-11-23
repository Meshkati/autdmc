const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async');
const bodyValidationMiddleware = require('../../middlewares/validation').bodyValidation;
const validationSchema = require('../../validations/signup-teams').signupSchema;

const bcrypt = require('bcrypt');
const generatePassword = require('../../util/passwd-gen').generatePassword;

router.get('/', asyncMiddleware(async (req, res) => {
    res.json({b: 13})
}));



router.post('/', bodyValidationMiddleware(validationSchema) ,asyncMiddleware(async (req, res) => {



    let hash = await bcrypt.hash('somepassword', 10);

    let cmp1 = await bcrypt.compare('somepassword', hash);
    let cmp2 = await bcrypt.compare('somepasswor2', hash);
    res.json({
        body: req.body,
        pass: generatePassword(10),
        cmp1: cmp1,
        cmp2: cmp2
    });
}));
module.exports = router;
