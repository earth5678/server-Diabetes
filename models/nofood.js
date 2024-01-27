const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
// Define the schema for food information
const NofoodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  foodImage: {
    type: String,
    required: true,
  },
  foodDetail: {
    type: String,
    required: true,
  },
});

const NoFood = mongoose.model('NoFood', NofoodSchema);

module.exports = NoFood;
