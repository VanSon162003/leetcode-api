const express = require("express");
const { CategoryController } = require("../controllers/category.controller.js");

const router = express.Router();
const categoryController = new CategoryController();

// Category routes
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = { categoryRoutes: router };
