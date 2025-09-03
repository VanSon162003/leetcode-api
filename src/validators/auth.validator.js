const Joi = require("joi");

const validateRegistration = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.alphanum': 'Username must only contain alphanumeric characters',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 30 characters',
                'any.required': 'Username is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(6)
            .max(128)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password cannot exceed 128 characters',
                'any.required': 'Password is required'
            }),
        firstName: Joi.string()
            .max(100)
            .allow('')
            .optional(),
        lastName: Joi.string()
            .max(100)
            .allow('')
            .optional()
    });

    return schema.validate(data);
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    });

    return schema.validate(data);
};

const validateProfileUpdate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .max(100)
            .allow('')
            .optional(),
        lastName: Joi.string()
            .max(100)
            .allow('')
            .optional(),
        avatar: Joi.string()
            .uri()
            .max(500)
            .allow('')
            .optional()
    });

    return schema.validate(data);
};

const validatePasswordChange = (data) => {
    const schema = Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'any.required': 'Current password is required'
            }),
        newPassword: Joi.string()
            .min(6)
            .max(128)
            .required()
            .messages({
                'string.min': 'New password must be at least 6 characters long',
                'string.max': 'New password cannot exceed 128 characters',
                'any.required': 'New password is required'
            })
    });

    return schema.validate(data);
};

module.exports = { 
    validateRegistration, 
    validateLogin, 
    validateProfileUpdate, 
    validatePasswordChange 
};

