const Joi = require("joi");

const validateProblem = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        slug: Joi.string().required(),
        description: Joi.string().required(),
        difficulty: Joi.string().valid("Easy", "Medium", "Hard").required(),
        categoryId: Joi.number().integer().positive().required(),
        timeLimit: Joi.number().integer().positive().default(2),
        memoryLimit: Joi.number().integer().positive().default(128),
        starterCode: Joi.object().pattern(
            Joi.string(), // language key
            Joi.string() // starter code
        ),
        hints: Joi.string().allow(''),
        isActive: Joi.boolean().default(true)
    });

    return schema.validate(data);
};

const validateTestCase = (data) => {
    const schema = Joi.object({
        problemId: Joi.number().integer().positive().required(),
        input: Joi.string().required(),
        expectedOutput: Joi.string().required(),
        isHidden: Joi.boolean().default(false),
        order: Joi.number().integer().min(0).default(0)
    });

    return schema.validate(data);
};

module.exports = { validateProblem, validateTestCase };
