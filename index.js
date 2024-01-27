require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const foodRoutes = require('./routes/food');
const forbiddenRoutes = require('./routes/forbidden');
const ChatRoutes = require("./routes/users");
const MealPatientRoutes =require("./routes/mealTracking");
const conversations = require("./routes/conversation")

connection();

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api",conversations)
app.use("/", foodRoutes);
app.use("/", ChatRoutes);
app.use("/", forbiddenRoutes);
app.use("/", MealPatientRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});