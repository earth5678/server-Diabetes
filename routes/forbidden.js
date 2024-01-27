const express = require('express');
const router = express.Router();

const NoFood = require('../models/nofood');

// Create
router.post('/forbidden', async (req, res) => {
    try {
        const newFood = new NoFood(req.body);
        const savedFood = await newFood.save();
        res.status(201).json(savedFood);
    } catch (error) {
        console.error('Error creating food:', error);
        res.status(500).json({ error: error.message });
    }
});

// Read (All)
router.get('/forbidden', async (req, res) => {
    try {
        const noFoods = await NoFood.find();
        res.status(200).json(noFoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read (Single)
router.get('/forbidden/:id', async (req, res) => {
    try {
        const food = await NoFood.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }
        res.status(200).json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update
router.put('/forbidden/:id', async (req, res) => {
    try {
        const updatedFood = await NoFood.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFood) {
            return res.status(404).json({ error: 'Food not found' });
        }
        res.status(200).json(updatedFood);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete
router.delete('/forbidden/:id', async (req, res) => {
    try {
        const deletedFood = await NoFood.findByIdAndRemove(req.params.id);
        if (!deletedFood) {
            return res.status(404).json({ error: 'Food not found' });
        }
        res.status(200).json(deletedFood);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
