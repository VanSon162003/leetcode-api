const Joi = require("joi");

const validateSubmission = (data) => {
    const schema = Joi.object({
        source_code: Joi.string().min(1).max(100000).required().messages({
            'string.empty': 'Source code cannot be empty',
            'string.min': 'Source code must be at least 1 character long',
            'string.max': 'Source code cannot exceed 100,000 characters',
            'any.required': 'Source code is required'
        }),
        language_id: Joi.number().integer().min(1).max(100).required().messages({
            'number.base': 'Language ID must be a number',
            'number.integer': 'Language ID must be an integer',
            'number.min': 'Language ID must be at least 1',
            'number.max': 'Language ID must not exceed 100',
            'any.required': 'Language ID is required'
        }),
        stdin: Joi.string().allow("").max(10000).optional().messages({
            'string.max': 'Input cannot exceed 10,000 characters'
        }),
        problemId: Joi.string().optional().messages({
            'string.base': 'Problem ID must be a string'
        }),
        testCases: Joi.array().items(
            Joi.object({
                input: Joi.string().required().messages({
                    'string.empty': 'Test case input cannot be empty',
                    'any.required': 'Test case input is required'
                }),
                output: Joi.string().required().messages({
                    'string.empty': 'Test case output cannot be empty',
                    'any.required': 'Test case output is required'
                })
            })
        ).optional().messages({
            'array.base': 'Test cases must be an array'
        })
    });

    return schema.validate(data);
};

const validateTestCasesSubmission = (data) => {
    const schema = Joi.object({
        source_code: Joi.string().min(1).max(100000).required().messages({
            'string.empty': 'Source code cannot be empty',
            'string.min': 'Source code must be at least 1 character long',
            'string.max': 'Source code cannot exceed 100,000 characters',
            'any.required': 'Source code is required'
        }),
        language_id: Joi.number().integer().min(1).max(100).required().messages({
            'number.base': 'Language ID must be a number',
            'number.integer': 'Language ID must be an integer',
            'number.min': 'Language ID must be at least 1',
            'number.max': 'Language ID must not exceed 100',
            'any.required': 'Language ID is required'
        }),
        problemId: Joi.string().optional().messages({
            'string.base': 'Problem ID must be a string'
        }),
        testCases: Joi.array().min(1).max(100).items(
            Joi.object({
                input: Joi.string().required().messages({
                    'string.empty': 'Test case input cannot be empty',
                    'any.required': 'Test case input is required'
                }),
                output: Joi.string().required().messages({
                    'string.empty': 'Test case output cannot be empty',
                    'any.required': 'Test case output is required'
                })
            })
        ).required().messages({
            'array.base': 'Test cases must be an array',
            'array.min': 'At least one test case is required',
            'array.max': 'Cannot exceed 100 test cases',
            'any.required': 'Test cases are required'
        })
    });

    return schema.validate(data);
};

module.exports = { validateSubmission, validateTestCasesSubmission };
