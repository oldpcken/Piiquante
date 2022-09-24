// MongoDB cluster pwd: EPitN5vUleBHxh7P
// MongoDB connection: mongodb+srv://oldpcken:EPitN5vUleBHxh7P@cluster0.uowkhi1.mongodb.net/?retryWrites=true&w=majority

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://oldpcken:EPitN5vUleBHxh7P@cluster0.uowkhi1.mongodb.net/?retryWrites=true&w=majority')
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

app.use('/api/auth', userRoutes);

module.exports = app;