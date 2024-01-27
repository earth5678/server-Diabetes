const mongoose = require("mongoose");

module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    const dbURL = "mongodb+srv://diabet:1111@cluster0.ykyrfhv.mongodb.net/";

    await mongoose.connect(dbURL, connectionParams);

    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Could not connect to the database:", error);
  }
};
