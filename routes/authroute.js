const express = require("express");
const router = express.Router();

const {
  signController,
  loginController,
} = require("../controllers/authController");

const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/signup", signController);
router.post("/login", loginController);

// testing route
router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the protected route for test!!",
  });
});

// protected route
router.get("/student", auth, isStudent, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the protected route for the student!!",
  });
});
router.get("/admin", auth, isAdmin, (req, res) => {
  res.status(200).json({
    succes: true,
    message: "Welcome to protected route for the admin!!",
  });
});

module.exports = router;
