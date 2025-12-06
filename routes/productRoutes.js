const express = require("express");
const router = express.Router()
const { getProducts, createProduct, deleteProduct, getProduct } = require('../controller/productController')
const { adminProtect } = require('../controller/authController')

router.get('/', getProducts)
router.get('/:id', getProduct)

router.post('/', adminProtect, createProduct)
router.delete('/:id', adminProtect, deleteProduct)