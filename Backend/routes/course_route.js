import express from "express";
import multer from "multer";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseDetails,
  buyCourses,
} from "../controllers/course_controller.js";
import userMiddleware from "../middlewares/user_mid.js";
import adminMiddleware from "../middlewares/admin_mid.js";

const router = express.Router();

// multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 10 MB limit
});
  


router.post(
  "/create",
    adminMiddleware,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "pyqs", maxCount: 1 },
      { name: "notes", maxCount: 1 },
      { name: "practice", maxCount: 1 },
  ]),
  createCourse
);

router.put("/update/:courseId", adminMiddleware,
  upload.fields([
      { name: "image", maxCount: 1 },
      { name: "pyqs", maxCount: 1 },
      { name: "notes", maxCount: 1 },
      { name: "practice", maxCount: 1 },
  ]), updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);
router.get("/getcourses", getAllCourses);
router.get("/getcourse/:courseId", getCourseDetails);
router.post("/buy/:courseId", userMiddleware, buyCourses);

export default router;