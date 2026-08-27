import express from "express";
import {registerAdmin,loginAdmin, getDashboardStats,} from "../controller/AdminController.js";
import { getAllUsers,deleteUser,getSingleUser,
  createUser, updateUser, toggleBlockUser } from "../controller/AdminUserController.js";
import adminAuth from "../middlewear/AdminMiddlewear.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/profile", adminAuth, (req, res) => {
  res.json({
    message: "Admin profile",
    admin: req.admin,
  });
});
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({
    message: "Welcome to admin dashboard",
    admin: req.admin
  });
});


router.get("/users", adminAuth, getAllUsers);

router.get("/users/:id", adminAuth, getSingleUser);

router.delete("/users/:id", adminAuth, deleteUser);

router.post("/users", adminAuth, createUser);

router.put("/users/:id", adminAuth, updateUser);

router.patch("/users/:id/block",adminAuth,toggleBlockUser);

router.get("/dashboard/stats", adminAuth, getDashboardStats);

export default router;
