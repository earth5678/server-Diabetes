const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const foodSchema = new mongoose.Schema({
  FoodName: {
    type: String,
    required: true,
  },
  FoodProtein: {
    type: Number,
    required: true,
  },
  FoodFat: {
    type: Number,
    required: true,
  },
  FoodCarbo: {
    type: Number,
    required: true,
  },
  FoodFiber: {
    type: Number,
    required: true,
  },
  FoodCalorie: {
    type: Number,
    required: true,
  },
  FoodImage: {
    type: String,
    required: true,
  },
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
