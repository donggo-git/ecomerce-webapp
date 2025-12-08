const User = require('../models/User')
const Product = require('../models/Product')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
        return res.status(400).json({ message: "Username, password and email are require" })

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser)
        return res.status(409).json({ message: "This email is already register" })

    const user = await User.create({ username, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
        username,
        email,
        token
    })
}

const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({
            Error: {
                Code: "BadRequest",
                Message: "Email/Username and password are required"
            }
        });
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        return res.status(422).json({
            Error: {
                Code: "InvalidCredentials",
                Message: "Invalid username or email"
            }
        });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(422).json({
            Error: {
                Code: "InvalidCredentials",
                Message: "Incorrect password"
            }
        });
    }

    const token = generateToken(user._id);

    res.status(200).json({
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.role == 'admin'
        }
    });
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({
                Error: {
                    Code: "InvalidUserId",
                    Message: "User ID format is invalid"
                }
            });
        }

        // If the requesting user is not the same and not admin
        if (req.user._id.toString() !== id && !req.user.isAdmin) {
            return res.status(403).json({
                Error: {
                    Code: "Forbidden",
                    Message: "You are not allowed to access this user"
                }
            });
        }

        const user = await User.findById(id).select('-password').populate('favoriteProducts');

        if (!user) {
            return res.status(404).json({
                Error: {
                    Code: "NotFound",
                    Message: "User does not exist"
                }
            });
        }

        res.status(200).json(user);

    } catch (err) {
        console.error("GET USER ERROR:", err);
        res.status(500).json({
            Error: {
                Code: "InternalServerError",
                Message: "Failed to fetch user"
            }
        });
    }
};


const verify = async (req, res) => {
    res.json({ user: req.user })
}


const updateProfile = async (req, res) => {
    const { username, email, password } = req.body;

    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (password) req.user.password = password;

    await req.user.save();
    res.json(req.user);
}

const addFavoriteProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(422).json({
                Error: {
                    Code: "InvalidProductId",
                    Message: "Product ID format is invalid"
                }
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                Error: {
                    Code: 404,
                    Message: "Product does not exist"
                }
            });
        }

        if (req.user.favoriteProducts.includes(productId)) {
            return res.status(409).json({
                Error: {
                    Code: "DuplicateFavorite",
                    Message: "Product already in favorites"
                }
            });
        }

        req.user.favoriteProducts.push(productId);
        await req.user.save();

        res.status(200).json({
            message: "Product added to favorites",
            favoriteProducts: req.user.favoriteProducts
        });

    } catch (err) {
        console.error("ADD FAVORITE ERROR:", err);
        res.status(500).json({
            Error: {
                Code: "InternalServerError",
                Message: "Failed to favorite product"
            }
        });
    }
};

const removeFavoriteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(422).json({
                Error: {
                    Code: "InvalidProductId",
                    Message: "Product ID format is invalid"
                }
            });
        }

        const index = req.user.favoriteProducts.indexOf(productId);

        if (index === -1) {
            return res.status(404).json({
                Error: {
                    Code: "NotFound",
                    Message: "Product not found in favorites"
                }
            });
        }

        req.user.favoriteProducts.splice(index, 1);
        await req.user.save();

        res.status(200).json({
            message: "Product removed from favorites",
            favoriteProducts: req.user.favoriteProducts
        });

    } catch (err) {
        console.error("REMOVE FAVORITE ERROR:", err);
        res.status(500).json({
            Error: {
                Code: "InternalServerError",
                Message: "Failed to remove favorite"
            }
        });
    }
};

const getFavoriteProducts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = 5;

        await req.user.populate({
            path: 'favoriteProducts',
            options: {
                skip: (page - 1) * pageSize,
                limit: pageSize
            }
        });

        const total = req.user.favoriteProducts.length;

        res.status(200).json({
            page,
            pageSize,
            favorites: req.user.favoriteProducts
        });

    } catch (err) {
        console.error("GET FAVORITES ERROR:", err);
        res.status(500).json({
            Error: {
                Code: "InternalServerError",
                Message: "Failed to load favorite products"
            }
        });
    }
};


module.exports = {
    register, login, verify, updateProfile, addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts, getUser
}