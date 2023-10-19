const Joi = require('joi');

const emaiResendSchema = Joi.object({
    email: Joi.string().email().required().messages({ "any.required": "missing required field email" }),
    
});

module.exports = emaiResendSchema;