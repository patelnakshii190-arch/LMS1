const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// REGISTER

router.post("/register", async (req, res) => {

  try {

    const { name, email, password, role } = req.body;


    const existing = await User.findOne({
      email: email.toLowerCase()
    });


    if(existing){
      return res.status(400).json({
        message:"Email already registered"
      });
    }


    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "student"
    });


    await user.save();



    const token = generateToken(user);



    // Store token in cookie
    res.cookie("token", token, {
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge:7 * 24 * 60 * 60 * 1000
    });



    res.status(201).json({

      message:"Registration successful",

      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }

    });



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});




// LOGIN

router.post("/login", async(req,res)=>{

  try{


    const {email,password}=req.body;



    const user = await User.findOne({
      email:email.toLowerCase()
    });



    if(!user){

      return res.status(400).json({
        message:"Invalid email or password"
      });

    }



    const valid = await user.comparePassword(password);



    if(!valid){

      return res.status(400).json({
        message:"Invalid email or password"
      });

    }



    const token = generateToken(user);



    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge:7 * 24 * 60 * 60 * 1000
    });



    res.json({

      message:"Login successful",

      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }

    });



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});




// LOGOUT

router.post("/logout",(req,res)=>{

  res.clearCookie("token");

  res.json({
    message:"Logout successful"
  });

});



module.exports = router;