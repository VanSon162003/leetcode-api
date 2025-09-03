const { AuthService } = require('../services/auth.service.js');

class AuthMiddleware {
    constructor() {
        this.authService = new AuthService();
    }

    authenticate = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    error: 'Access denied. No token provided.'
                });
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            
            const decoded = await this.authService.verifyToken(token);
            const user = await this.authService.getUserById(decoded.userId);
            
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid token. User not found.'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                error: 'Invalid token.'
            });
        }
    };

    optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                req.user = null;
                return next();
            }

            const token = authHeader.substring(7);
            const decoded = await this.authService.verifyToken(token);
            const user = await this.authService.getUserById(decoded.userId);
            
            req.user = user;
            next();
        } catch (error) {
            req.user = null;
            next();
        }
    };
}

module.exports = { AuthMiddleware };

