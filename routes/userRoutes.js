const express = require('express')
const router = express.Router()
const { login, register, updateProfile, addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts, getUser } = require('../controller/userController')
const { protect } = require('../controller/authController')

router.post('/login', login)
router.post('/register', register)

router.patch('/update-profile', protect, updateProfile)

router.post('/favorites', protect, addFavoriteProduct);
router.delete('/favorites/:productId', protect, removeFavoriteProduct);
router.get('/favorites', protect, getFavoriteProducts);

router.get('/:id', protect, getUser);

module.exports = router