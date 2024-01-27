const express = require('express');
const router = express.Router();

const Food = require('../models/food');

router.post('/foods', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/foods/:id', async (req, res) => {
  try {

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedFood) {
      console.log('Food not found');
      return res.status(404).json({ error: 'Food not found' });
    }
    console.log('Food updated successfully:', updatedFood);
    res.status(200).json(updatedFood);
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ error: error.message });
  }
});


router.delete('/foods/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
