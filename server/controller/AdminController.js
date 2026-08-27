import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../model/AdminModel.js";
import User from "../model/UserModel.js"

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// login

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.secret,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const blockedUsers = await User.countDocuments({
      isBlocked: true,
    });

    const activeUsers = await User.countDocuments({
      isBlocked: false,
    });

    const totalAdmins = await Admin.countDocuments();

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalAdmins,
      },
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
