const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
// Custom validator for URL validation
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
module.exports.validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The "name" field must be at least 2 characters long',
      "string.max": 'The "name" field must not exceed 30 characters',
      "string.empty": 'The "name" field is required',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field is required',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The "name" field must be at least 2 characters long',
      "string.max": 'The "name" field must not exceed 30 characters',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field is required',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field is required',
    }),
  }),
});
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field is required',
    }),
  }),
});
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.empty": 'The "id" field is required',
      "string.hex": 'The "id" field must be a valid hexadecimal',
      "string.length": 'The "id" field must be 24 characters long',
    }),
  }),
});
