'use strict';

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const initializeDb = async () => {
    try {
        // Database connection logic
        console.log('Connecting to the database...');
        await mongoose.connect('mongodb://localhost/mydatabase', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit with code 1 on failure
    }
};

process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    await mongoose.disconnect();
    console.log('Disconnected from database.');
    process.exit(0);
});

const startServer = async () => {
    await initializeDb();
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};

startServer();
