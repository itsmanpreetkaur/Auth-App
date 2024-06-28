const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.authController = async (req, res) => {
  try {
    // data fetch from the request body
    const { user, email, password, role } = req.body;
    // check that user is registered or not
    const registeredUser = await User.findOne({ email });

    if (registeredUser) {
      return res.status(201).json({
        data: registeredUser,
        message: "User already registered!!",
      });
    }
    // if not do password hashing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 5);
      const newUser = await User.create({
        user,
        email,
        password: hashedPassword,
        role,
      });
      res.status(200).json({
        status: true,
        data: newUser,
        message: "User registered successfully!!",
      });
    } catch (error) {
      return res.status(500).json({
        message: "problem in hashing the password",
        message: error.message,
      });
    }
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
