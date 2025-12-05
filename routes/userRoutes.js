const express = require('express')
const router = express.Router()

//regular user
router.post('/login', () => { })
router.post('/register', () => { })
router.patch('/like', () => { })
router.get('/favorite-product', () => { })
//admin
router.get('/users', () => { })
//admin get user favorite product list
router.get('/users/:id', () => { })