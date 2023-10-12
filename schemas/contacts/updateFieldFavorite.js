const Joi = require('joi');

const updateFieldFavorite = Joi.object({
    favorite: Joi.boolean()
        .required()
        .messages({ "any.required": "missing field favorite" })
    
});


module.exports = updateFieldFavorite;