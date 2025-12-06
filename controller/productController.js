// controllers/songsController.js
const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const pageNumber = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = 9;

        const { search = '', brand = '', type = '' } = req.query;

        const filter = {};

        if (search.trim() !== '') {
            filter.$or = [
                { brand: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        if (brand.trim() !== '') {
            filter.brand = { $regex: `^${brand}$`, $options: 'i' };
        }

        if (type.trim() !== '') {
            filter.type = { $regex: `^${type}$`, $options: 'i' };
        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        res.json({
            total,
            pageNumber,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            products
        });

    } catch (err) {
        console.error('LIST SONGS ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, brand, type, description, price } = req.body;
        if (!name || !brand || !type || !description || !price) {
            return res.status(400).json({ error: 'product name, brand, type, description and price are required' });
        }
        const product = await Product.create({
            name,
            brand,
            type,
            description,
            price
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create song' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const removed = await Product.findByIdAndDelete(productId);
        if (!removed) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Deleted', id: productId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete song' });
    }
};

const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({ error: 'Product not found' })
        res.json(product)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to find product' })
    }
}

module.exports = { getProducts, createProduct, deleteProduct, getProduct };
