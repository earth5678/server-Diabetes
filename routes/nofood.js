const express = require('express');
const router = express.Router();

const NoFood = require('../models/nofood'); // Fix the casing here

router.post('/nofood', async (req, res) => {
    try {
        console.log('Incoming request body:', req.body);

        const newFood = new NoFood(req.body); // Fix the casing here
        const savedFood = await newFood.save();
        res.status(201).json(savedFood);
    } catch (error) {
        console.error('Error creating food:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/nofood', async (req, res) => {
    try {
        const noFoods = await NoFood.find(); // Fix the casing here
        res.status(200).json(noFoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
