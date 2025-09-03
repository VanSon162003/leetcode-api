const { StatusCodes } = require("http-status-codes");
const { AuthService } = require("../services/auth.service.js");
const { 
    validateRegistration, 
    validateLogin, 
    validateProfileUpdate, 
    validatePasswordChange 
} = require("../validators/auth.validator.js");

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {
            const { error } = validateRegistration(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const user = await this.authService.register(req.body);
            res.status(StatusCodes.CREATED).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            console.error("Error in register:", error);
            res.status(StatusCodes.BAD_REQUEST).json({
                error: error.message,
            });
        }
    };

    login = async (req, res) => {
        try {
            const { error } = validateLogin(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const result = await this.authService.login(req.body);
            res.status(StatusCodes.OK).json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            console.error("Error in login:", error);
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: error.message,
            });
        }
    };

    getProfile = async (req, res) => {
        try {
            const user = await this.authService.getUserById(req.user.id);
            res.status(StatusCodes.OK).json(user);
        } catch (error) {
            console.error("Error in getProfile:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while fetching profile",
            });
        }
    };

    updateProfile = async (req, res) => {
        try {
            const { error } = validateProfileUpdate(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const user = await this.authService.updateProfile(req.user.id, req.body);
            res.status(StatusCodes.OK).json({
                message: 'Profile updated successfully',
                user
            });
        } catch (error) {
            console.error("Error in updateProfile:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    };

    changePassword = async (req, res) => {
        try {
            const { error } = validatePasswordChange(req.body);
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details[0].message,
                });
            }

            const { currentPassword, newPassword } = req.body;
            const result = await this.authService.changePassword(
                req.user.id, 
                currentPassword, 
                newPassword
            );
            
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(StatusCodes.BAD_REQUEST).json({
                error: error.message,
            });
        }
    };

    logout = async (req, res) => {
        try {
            // In a more sophisticated implementation, you might want to blacklist the token
            // For now, we'll just return a success message
            res.status(StatusCodes.OK).json({
                message: 'Logout successful'
            });
        } catch (error) {
            console.error("Error in logout:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "An error occurred during logout",
            });
        }
    };
}

module.exports = { AuthController };

