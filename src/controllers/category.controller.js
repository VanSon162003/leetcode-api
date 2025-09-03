const { StatusCodes } = require("http-status-codes");
const { CategoryService } = require("../services/category.service.js");
const Joi = require("joi");

const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        slug: Joi.string().required()
    });
    return schema.validate(data);
};

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
    }

    createCategory = async (req, res) => {
        try {
            const { error } = validateCategory(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const category = await this.categoryService.createCategory(req.body);
            res.status(StatusCodes.CREATED).json(category);
        } catch (error) {
            console.error("Error in createCategory:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while creating the category",
            });
        }
    };

    getCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategory(id);

            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Category not found",
                });
            }

            res.status(StatusCodes.OK).json(category);
        } catch (error) {
            console.error("Error in getCategory:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while fetching the category",
            });
        }
    };

    getAllCategories = async (req, res) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(StatusCodes.OK).json(categories);
        } catch (error) {
            console.error("Error in getAllCategories:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while fetching categories",
            });
        }
    };

    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const { error } = validateCategory(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const category = await this.categoryService.updateCategory(id, req.body);
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Category not found",
                });
            }

            res.status(StatusCodes.OK).json(category);
        } catch (error) {
            console.error("Error in updateCategory:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while updating the category",
            });
        }
    };

    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.categoryService.deleteCategory(id);

            if (!deleted) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Category not found",
                });
            }

            res.status(StatusCodes.NO_CONTENT).send();
        } catch (error) {
            console.error("Error in deleteCategory:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while deleting the category",
            });
        }
    };
}

module.exports = { CategoryController };
