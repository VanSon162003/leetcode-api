const express = require("express");
const { AuthController } = require("../controllers/auth.controller.js");
const { AuthMiddleware } = require("../middleware/auth.middleware.js");

const router = express.Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes (require authentication)
router.get("/profile", authMiddleware.authenticate, authController.getProfile);
router.put("/profile", authMiddleware.authenticate, authController.updateProfile);
router.put("/change-password", authMiddleware.authenticate, authController.changePassword);
router.post("/logout", authMiddleware.authenticate, authController.logout);

module.exports = { authRoutes: router };

