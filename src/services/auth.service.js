const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }

    async register(userData) {
        try {
            const { username, email, password, firstName, lastName } = userData;

            // Check if user already exists
            const { Op } = require('sequelize');
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email },
                        { username: username }
                    ]
                }
            });

            if (existingUser) {
                throw new Error('User with this email or username already exists');
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName
            });

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return userResponse;
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    async login(credentials) {
        try {
            const { email, password } = credentials;

            // Find user by email
            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check if user is active
            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Update last login
            await user.update({ lastLoginAt: new Date() });

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email,
                    username: user.username 
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiresIn }
            );

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return {
                user: userResponse,
                token
            };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });
            return user;
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    async updateProfile(userId, updateData) {
        try {
            const { firstName, lastName, avatar } = updateData;
            
            const [updatedRowsCount] = await User.update(
                { firstName, lastName, avatar },
                { where: { id: userId } }
            );

            if (updatedRowsCount === 0) {
                throw new Error('User not found');
            }

            const updatedUser = await this.getUserById(userId);
            return updatedUser;
        } catch (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Hash new password
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update password
            await user.update({ password: hashedNewPassword });

            return { message: 'Password changed successfully' };
        } catch (error) {
            throw new Error(`Failed to change password: ${error.message}`);
        }
    }
}

module.exports = { AuthService };
