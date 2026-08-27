import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../model/UserModel.js"

dotenv.config()

const secret = process.env.secret



export const signup = async (req,res)=>{
 
    const {name,email,password}=  req.body
   console.log(req.body);

try{
    if(!name || !email || !password){
        res.status(400).json({
            success : false,
            message : "data not found"
        })
        return
    }

     const  hashedPassword = await bcrypt.hash(password,10)   

     const result = await User.create({
        name,email,password:hashedPassword,
     })
 
     const token = jwt.sign({
        userId : result._id},secret)

        
        
       return res.status(200).json({
            success : true,
            message : "user created successfuly",
            token,
            data : result
        })
}catch(error){
    console.log(error.message);
     return res.status(500).json({
      success: false,
      message: error.message,
    });
}
}

export const login = async (req,res)=>{
    const {email , password}= req.body
    

   try{
     const result = await User.findOne({email})
console.log(result);

       if(!result){
      return  res.status(502).json({
        success : false,
        message : " user not found"
        })
    
    }
    const isMatch = await bcrypt.compare(password,result.password)
    if(!isMatch){
     return   res.status(401).json({
            success : false,
            message: "invalid password"
        })
    }

    if (result.isBlocked) {
  return res.status(403).json({
    message: "Your account has been blocked by admin",
  });
}

    const token = jwt.sign({userId:result._id},secret)
    return res.status(200).json({
        success : true,
        message : "user login successfuly ",
        token,
    })
   }catch(error){
    console.log(error .message);
     return res.status(500).json({
            success: false,
            message: error.message
        })
   }
}
// user profile


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// user update

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// USER DELETE
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
