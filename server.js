// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes')
const productRouter = require('./routes/productRoutes')
const mongoose = require('mongoose')
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = `mongodb+srv://test:${process.env.MONGODB_PASSWORD}@cluster0.vut8hsn.mongodb.net/?appName=Cluster0`;

mongoose.connect(MONGO_URI).then(con => {
    console.log('DB connection successful')
}).catch(err => {
    console.log(err)
})

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/product', productRouter);

// After all other routes in Express app
app.get('*', (req, res) => {
    // Check if req.path matches any known route pattern
    const validPaths = ['/', '/login', '/register', '/home', '/product', '/favorites', '/admin'];
    const isValid = validPaths.some(path => req.path.startsWith(path));
    if (!isValid) {
        res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
