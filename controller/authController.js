const jwt = require("jsonwebtoken")
const User = require('../models/User')
require('dotenv').config()

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                Error: {
                    Code: "NoToken",
                    Message: "Not authorized, no token"
                }
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                Error: {
                    Code: "UserNotFound",
                    Message: "User not found"
                }
            });
        }

        next();
    } catch (err) {
        console.error("PROTECT ERROR:", err);
        return res.status(401).json({
            Error: {
                Code: "InvalidToken",
                Message: "Login expired or invalid token"
            }
        });
    }
};


const adminProtect = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access only' });
    }
    next();
}

module.exports = { protect, adminProtect }