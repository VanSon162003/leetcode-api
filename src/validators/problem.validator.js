import Joi from "joi";

export const validateProblem = (data) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        difficulty: Joi.string().valid("Easy", "Medium", "Hard").required(),
        categoryId: Joi.string().required(),
        testCases: Joi.array()
            .items(
                Joi.object({
                    input: Joi.string().required(),
                    output: Joi.string().required(),
                    isHidden: Joi.boolean().default(false),
                })
            )
            .min(1)
            .required(),
        timeLimit: Joi.number().positive(),
        memoryLimit: Joi.number().positive(),
        starterCode: Joi.object().pattern(
            Joi.string(), // language key
            Joi.string() // starter code
        ),
    });

    return schema.validate(data);
};
