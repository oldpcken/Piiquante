// in /backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();
dotenv.config();

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uowkhi1.mongodb.net/?retryWrites=true&w=majority`

// Log into the MongoDB database 
mongoose.connect(connectionString)
    .then(() => {
        console.log('Sucessfully Connected to MongoDB Atlas!');  
    })
    .catch((error) => {
        console.log('Unable to Connect to MongoDB Atlas!');
        console.error(error);
    });
  
app.use(express.json());

// set up cross-origin resource sharing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;