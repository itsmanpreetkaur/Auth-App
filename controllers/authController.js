const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { options } = require("../routes/authroute");
require("dotenv").config();

exports.signController = async (req, res) => {
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
      hashedPassword = await bcrypt.hash(password, 10);
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


exports.loginController = async(req,res)=>{
  try
  {
    // fetch the data from the request body
    const {email,password} = req.body;
    // check that details are empty or not
    if(!email || !password)
    {
       return res.status(400).json(
        {
          success:false, 
          message: "Please fill all the details carefully!!"
        }
      );
    }
    // if user is not registered
    let user = await User.findOne({email});

    // user is not registered
    if(!user)
    {
      return res.satus(401).json(
        {
          success: false,
          message : "User is not registered!!"
        }
      );
    }
    
    // check the password
    const payload = {
      email : user.email,
      id : user._id,
      role : user.role
    }
    if(await bcrypt.compare(password, user.password))
    {
      // generate jwt token so that user donot need to login again and again
      const token = jwt.sign(payload, process.env.JWT_TOKEN, {
        expiresIn: "2h"
      } );

      user = user.toObject();
      user.token = token;
      user.password = undefined;
      const options = {
        expiresIn : Date.now() + 3 * 24 * 60 * 60 * 1000,
        // forbids the js to alter it on client side
        httpOnly: true
      }
      res.cookie("token", token, options).status(200).json(
        {
          sucess: true,
          token,
          user,
          message : "User logged in successfully!!"
        }
      );
    }
    else
    {
      return res.status(401).json(
        {
          success: false,
          message: "Password incorrect!!"
        }
      );
    }
  }
  catch(error)
  {
    console.log(error);
    console.error(error);
    res.status(500).json(
      {
        success:false,
        message : "Internal Server Error"
      }
    );
  }
}