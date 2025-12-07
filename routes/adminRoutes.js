const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const isAdmin = require('../middleware/isAdmin');

const { getAllUsersSummary, getUserWithFavorites } = require('../controllers/adminController');

router.get('/users', protect, adminProtect, getAllUsersSummary);
router.get('/users/:userId', protect, adminProtect, getUserWithFavorites);

module.exports = router;
