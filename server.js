// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const songsRouter = require('./routes/songs');
const userRoutes = require('./routes/users');
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
//app.use('/api/product', productRouter);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
