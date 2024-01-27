const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
	  fullName: {
		type: String,
		required: true,
	  },
	  email: {
		type: String,
		required: true,
		unique: true,
	  },
	  password: {
		type: String,
		required: true,
	  },
	  image: {
		type: String,
		required: true,
	  },
	  dateOfBirth: {
		type: Date,
		required: true,
	  },
	  weight: {
		type: Number, // เพิ่มน้ำหนัก
		required: true,
	  },
	  height: {
		type: Number, // เพิ่มส่วนสูง
		required: true,
	  },
	  diabetesType: {
		type: String,
		required: true,
	  },
		challengeCalorie: {
		type: Number,
		required: true,
	  },
	  isAdmin: { type: Boolean, default: false }, // Default value is false
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		fullName: Joi.string().required().label("fullName"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),

	});
	return schema.validate(data);
};

module.exports = { User, validate };
