import { User } from "../modules/user_model.js";
import { Purchase } from "../modules/purchase_model.js";
import { Course } from "../modules/course_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

export const Signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    const userSchema = z.object({
        firstname: z.string().min(3, { message: "First name must be at least 3 characters long" }),
        lastname: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    });

    const validationResult = userSchema.safeParse(req.body);
    if (!validationResult.success) {
        const errors = validationResult.error.issues.map((err) => err.message);
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // In production, use bcrypt to hash the password

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ errors: "User already exists" });
        }
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!user || !isPasswordValid) {
            return res.status(403).json({ message: "Invalid email or password" });
        }
        //jwt token generation
        const token = jwt.sign({
            userId: user._id,

        },
            process.env.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true, //can't be accessed by client side js
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //CSRF attacks
        };// Set secure flag in production
        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login successful", user, token });
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

export const getPurchasedCourses = async (req, res) => {
    const userId = req.userId;

    try {
        const purchased = await Purchase.find({ userId })
        
        let purchasedCourseId = [];
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId);
        }
            const courseData = await Course.find({
                _id: { $in: purchasedCourseId }
            })
        
        res.status(200).json({ purchasedCourseId, courseData });
    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// export const getUserProfile = async (req, res) => {
//   try {
//     const { id } = req.params; // User ID from request params

//     const user = await User.findById(id).select('-password'); 
//     // Excluding password field for security

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // If using JWT middleware:
    const userId = req.userId; 

    const { firstname, lastname } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserProfile = async (req, res) => {
  const userId = req.userId; // decoded from token
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
