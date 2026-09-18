import express from "express";
import { signup, login, getProfile, updateProfile,deleteProfile } from "../controller/UserController.js";
import { authentication } from "../middlewear/AuthMiddlewear.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile",authentication, getProfile);
router.put("/profile",authentication, updateProfile);
router.delete("/profile",authentication, deleteProfile);


export default router;
