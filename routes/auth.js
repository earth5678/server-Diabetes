const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "อีเมลไม่ถูกต้อง" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "รหัสผ่านไม่ถูกต้อง" });

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).send({ message: "คุณไม่ได้รับอนุญาติให้เข้าถึง (สำหรับ Admin)" });
    }

    const token = user.generateAuthToken();

    res.status(200).send({
      data: { token },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};


module.exports = router;
