const { Category } = require("../models/index.js");

class CategoryService {
    constructor() {
        // Database operations using Sequelize models
    }

    async createCategory(categoryData) {
        try {
            const category = await Category.create(categoryData);
            return category;
        } catch (error) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    async getCategory(id) {
        try {
            const category = await Category.findByPk(id);
            return category;
        } catch (error) {
            throw new Error(`Failed to get category: ${error.message}`);
        }
    }

    async getAllCategories() {
        try {
            const categories = await Category.findAll({
                order: [['name', 'ASC']]
            });
            return categories;
        } catch (error) {
            throw new Error(`Failed to get categories: ${error.message}`);
        }
    }

    async updateCategory(id, categoryData) {
        try {
            const [updatedRowsCount] = await Category.update(categoryData, {
                where: { id }
            });
            
            if (updatedRowsCount === 0) {
                return null;
            }
            
            const updatedCategory = await this.getCategory(id);
            return updatedCategory;
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async deleteCategory(id) {
        try {
            const deletedRowsCount = await Category.destroy({
                where: { id }
            });
            
            return deletedRowsCount > 0;
        } catch (error) {
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }

    async getCategoryBySlug(slug) {
        try {
            const category = await Category.findOne({
                where: { slug }
            });
            return category;
        } catch (error) {
            throw new Error(`Failed to get category by slug: ${error.message}`);
        }
    }
}

module.exports = { CategoryService };
