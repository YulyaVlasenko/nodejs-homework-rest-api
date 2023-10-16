const Joi = require('joi');

const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid(...["starter", "pro", "business"]).default('starter'),
});

module.exports = registrationSchema;