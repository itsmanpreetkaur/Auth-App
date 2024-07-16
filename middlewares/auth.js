const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //extract token from the body
    const token = req.body.token;
    // check if present or not
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing !!",
      });
    }

    // verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_TOKEN);
      // put decode token to body
      req.user = payload;
      console.log(payload);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token is invalid!!",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Token verification is unsuccessfull!!",
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      return res.status(401).json({
        success: false,
        message: "Go back!! This is protected route for students!!",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Go back!! This is protected route for admin!!",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    });
  }
};
