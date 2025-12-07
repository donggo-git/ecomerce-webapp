const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = `mongodb+srv://test:${process.env.MONGODB_PASSWORD}@cluster0.vut8hsn.mongodb.net/?appName=Cluster0`;

// ✅ 5 Brands × 6 Products = 30
const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];
const types = ['Shoes', 'Clothing', 'Accessories'];

const generateProducts = () => {
    const products = [];
    let counter = 1;

    brands.forEach((brand) => {
        for (let i = 0; i < 6; i++) {
            const type = types[Math.floor(Math.random() * types.length)];

            products.push({
                name: `${brand} Product ${counter}`,
                brand,
                type,
                description: `High quality ${type.toLowerCase()} from ${brand}.`,
                price: (Math.random() * 100 + 20).toFixed(2), // 20–120
                image: `/images/product-${counter}.jpg` // optional if you use images
            });

            counter++;
        }
    });

    return products;
};

const seedProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        await Product.deleteMany();
        console.log('🗑 Existing products removed');

        const products = generateProducts();
        await Product.insertMany(products);

        console.log('✅ 30 Products Seeded Successfully');
        process.exit();

    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
};

seedProducts();
