const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();
dotenv.config();

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uowkhi1.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(connectionString)
    .then(() => {
        console.log('Sucessfully Connected to MongoDB Atlas!');  
    })
    .catch((error) => {
        console.log('Unable to Connect to MongoDB Atlas!');
        console.error(error);
    });
  
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces/', sauceRoutes);

module.exports = app;