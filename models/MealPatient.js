const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MealSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
  },
  BName: {
    type: String,
    default: '', 
  },
  Bcalories: {
    type: Number,
    required: true,
  },
  BProtein: {
    type: Number,
  },
  BFat: {
    type: Number,
  },
  BCarbohydrate: {
    type: Number,
  },
  BFiber: {
    type: Number,
  },
  LName: {
    type: String,
    default: '', 
  },
  Lcalories: {
    type: Number,
    required: true,
  },
  LProtein: {
    type: Number,
  },
  LFat: {
    type: Number,
  },
  LCarbohydrate: {
    type: Number,
  },
  LFiber: {
    type: Number,
  },
  DName: {
    type: String,
    default: '', 
  },
  Dcalories: {
    type: Number,
    required: true,
  },
  DProtein: {
    type: Number,
  },
  DFat: {
    type: Number,
  },
  DCarbohydrate: {
    type: Number,
  },
  DFiber: {
    type: Number,
  },
  SumCalorie: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

MealSchema.pre('save', function(next) {
  this.SumCalorie = this.Bcalories + this.Lcalories + this.Dcalories;
  next();
});

const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;
