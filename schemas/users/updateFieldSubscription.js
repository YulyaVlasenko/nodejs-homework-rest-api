const Joi = require('joi');

const updateFieldSubscription = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required()
        .messages({ "any.required": "missing field subscription" }),
    
});


module.exports = updateFieldSubscription;