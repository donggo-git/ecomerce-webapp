const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
        return res.status(400).json({ message: "Username, password and email are require" })

    const existedUser = await User.findOne({ email, username })
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
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ message: "Invalid email or password" })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" })

    const token = generateToken(user._id)
    res.json({ token })
}

const verify = async (req, res) => {
    res.json({ user: req.user })
}

const getProfile = async (req, res) => {
    res.json(req.user)
}

const updateProfile = async (req, res) => {
    const { username, email, password } = req.body;

    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (password) req.user.password = password;

    await req.user.save();
    res.json(req.user);
}

/*const addToFavoriteProduct = async (req, res) => {
    const { productId } = req.body;

    if (!req.user.favoriteProducts.includes(songId)) {
        req.user.likedSongs.push(songId)
        await req.user.save();
    }

    res.json({ likedSongs: req.user.likedSongs })
}

const getLikedSong = async (req, res) => {
    const pagedNumber = parseInt(req.params.pagedNumber);
    const pageSize = 5

    await req.user.populate({
        path: 'likedSongs',
        option: {
            skip: (pagedNumber - 1) * pageSize,
            limit: pageSize
        }
    })

    res.json({ likedSongs: req.user.likedSongs })
}
*/
module.exports = {
    register, login, verify, getProfile, updateProfile, /*likedSong, getLikedSong*/
}