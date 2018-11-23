const Joi = require('joi');

module.exports.bodyValidation = (validationSchema) =>
    (req, res, next)=>
    {
        try {
            let result = Joi.validate (req.body, validationSchema);
            console.log(result);
            if (result.error === null)
                next();
            else
                res.status(400).json(result.error)
        }catch (e) {
            console.log('validation failed')
        }

};
