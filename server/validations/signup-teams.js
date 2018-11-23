const Joi = require('joi');

const teamMemberSchema = Joi.object().keys({
    first_name: Joi.string().min(3).max(300).required(),
    last_name: Joi.string().min(3).max(300).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    cellphone: Joi.string().regex(/^09\d{9}$/).required()
});

module.exports.signupSchema = Joi.object().keys({
    team_name: Joi.string().min(3).max(300).required(),
    team_lead: teamMemberSchema,
    team_members: Joi.array().items(teamMemberSchema).max(4)
});
