

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Admin } from "../modules/admin_model.js";


export const Signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    const adminSchema = z.object({
        firstname: z.string().min(3, { message: "First name must be at least 3 characters long" }),
        lastname: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    });

    const validationResult = adminSchema.safeParse(req.body);
    if (!validationResult.success) {
        const errors = validationResult.error.issues.map((err) => err.message);
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // In production, use bcrypt to hash the password

    try {
        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const newAdmin = new Admin({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully" });
    }
    catch (error) {
        console.error("Error during admin signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email: email });
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!admin || !isPasswordValid) {
            return res.status(403).json({ message: "Invalid email or password" });
        }
        //jwt token generation
        const token = jwt.sign({
           id: admin._id,

        },
            process.env.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true, //can't be accessed by client side js
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //CSRF attacks
        };// Set secure flag in production
        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login successful", admin, token });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: "No token provided" });
    }
}

export const Logout = async (req, res) => {
    try {
        if(!req.cookies.jwt){
            return res.status(400).json({ message: "Kindly login first" });
        }
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error during admin logout:", error);
        res.status(500).json({ message: "Error in logout" });
    }
}
export const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        const admin = await Admin.findByIdAndDelete(adminId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "Error deleting admin" });
    }
};

// Get Admin details by ID
export const getAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Admin ID from request params

    const admin = await Admin.findById(id).select('-password'); 
    // Excluding password field for security

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};