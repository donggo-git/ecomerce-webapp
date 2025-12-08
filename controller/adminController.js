const User = require('../models/User');
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
    console.log(req.user); // inside adminProtect

    try {
        const users = await User.find()
            .select('username email favoriteProducts')
            .lean();

        const formattedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            favoriteCount: user.favoriteProducts.length
        }));

        res.status(200).json({
            count: formattedUsers.length,
            users: formattedUsers
        });

    } catch (err) {
        console.error("ADMIN USER SUMMARY ERROR:", err);
        res.status(500).json({
            Error: {
                Code: "InternalServerError",
                Message: "Failed to fetch users"
            }
        });
    }
};

const getUserWithFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(422).json({
                Error: {
                    Code: "InvalidUserId",
                    Message: "User ID format is invalid"
                }
            });
        }

        const user = await User.findById(userId)
            .select('username email favoriteProducts')
            .populate('favoriteProducts');

        if (!user) {
            return res.status(404).json({
                Error: {
                    Code: "NotFound",
                    Message: "User not found"
                }
            });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            favoriteProducts: user.favoriteProducts
        });

    } catch (err) {
        console.error("ADMIN SINGLE USER ERROR:", err);
        res.status(500).json({
            Error: {
                Code: "InternalServerError",
                Message: "Failed to fetch user details"
            }
        });
    }
};

module.exports = {
    getAllUsers,
    getUserWithFavorites
};
