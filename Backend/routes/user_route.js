import express from "express";

const router = express.Router();
import { 
    Signup,
    Login,
    Logout, 
    getPurchasedCourses, 
    updateUserProfile, 
    deleteUserProfile, 
    getUserProfile 
} from "../controllers/user_controller.js";
import path from "path";
import userMiddleware from "../middlewares/user_mid.js";

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/purchased",userMiddleware, getPurchasedCourses);
router.get("/profile",userMiddleware, getUserProfile);
router.put("/edit-profile", userMiddleware, updateUserProfile);
router.delete("/delete-profile",userMiddleware, deleteUserProfile);

export default router;