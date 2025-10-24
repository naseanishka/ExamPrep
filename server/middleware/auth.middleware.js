import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Protect routes - verify JWT from Authorization header or cookie
export const protect = async (req, res, next) => {
    try {
        let token;

        // Bearer token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            // Token from cookie
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded may contain { id } or { user: { id } } depending on how token was created
        const userId = decoded.id || decoded.user?.id || decoded.user || decoded.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Token payload invalid' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

// Allow only teachers
export const teacherOnly = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Teachers only.' });
};

// Allow only students
export const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Students only.' });
};

// Generic role authorizer
export const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
};