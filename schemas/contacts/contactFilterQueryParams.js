const Joi = require('joi');

const contactFilterQueryParams = {
    favorite: Joi.boolean(),
}
module.exports = contactFilterQueryParams;