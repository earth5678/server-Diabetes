const express = require('express');
const router = express.Router();

const MealPatient = require('../models/MealPatient');

router.get('/meals', async (req, res) => {
    try {
        const meals = await MealPatient.find();
        res.status(200).json(meals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
