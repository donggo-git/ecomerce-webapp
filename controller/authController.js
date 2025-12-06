const jwt = require("jsonwebtoken")
const User = require('../models/User')
require('dotenv').config()

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else {
        req.status(401).json({ message: "Not authorized" })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select('-password')
        next()
    } catch (err) {
        res.status(401).json({ message: 'Login expired' })
    }
}

const adminProtect = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access only' });
    }
    next();
}

module.exports = { protect, adminProtect }