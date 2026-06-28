import express from "express";
import { Signup,Login,Logout, getAdmin, deleteAdmin } from "../controllers/admin_controller.js";
const router = express.Router();



router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/getadmin/:id", getAdmin);
router.delete("/delete/:id", deleteAdmin);

export default router;