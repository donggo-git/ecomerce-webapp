const express = require('express');
const router = express.Router();

const { protect, adminProtect } = require('../controller/authController');
const { getAllUsers, getUserWithFavorites } = require('../controller/adminController');

router.get('/users', protect, adminProtect, getAllUsers);
router.get('/users/:userId', protect, adminProtect, getUserWithFavorites);

module.exports = router;
