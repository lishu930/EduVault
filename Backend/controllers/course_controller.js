import { Course } from "../modules/course_model.js";
import { Purchase } from "../modules/purchase_model.js";
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";
import multer from "multer";


export const createCourse = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        const { title, description, price } = req.body;
        const adminId = req.adminId;

        // ✅ Validate required fields
        if (!title || !description || !price) {
            return res.status(400).json({ errors: "Title, description, and price are required" });
        }

        // ✅ Validate files
        const requiredFiles = ["image", "pyqs", "notes", "practice"];
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: "No files uploaded" });
        }
        for (const key of requiredFiles) {
            if (!req.files[key]) {
                return res.status(400).json({ errors: `Missing required file: ${key}` });
            }
        }
        

        // ✅ Upload each file to Cloudinary
        const uploadResults = {};
        for (const key of requiredFiles) {
            const file = req.files[key][0]; // single file per field
            if (!file || !file.buffer) {
                return res.status(400).json({ error: `File buffer missing for ${key}` });
            }

            const type = key === "image" ? "image" : "raw"; // images vs PDFs/docs
            const result = await uploadToCloudinary(file.buffer, "course_assets", type);

            if (!result || result.error) {
                return res.status(500).json({ errors: `Error uploading ${key} to Cloudinary` });
            }

            uploadResults[key] = {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }

        // ✅ Create course document
        const newCourse = new Course({
            title,
            description,
            price,
            image: uploadResults.image,
            pyqs: uploadResults.pyqs,
            notes: uploadResults.notes,
            practice: uploadResults.practice,
            creatorId: adminId,
        });

        // console.log("req.files:", req.files);
        await newCourse.save();

        res.status(201).json({
            message: "Course created successfully",
            course: newCourse,
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ errors: "Error creating course" });
    }
};

// export const updateCourse = async (req, res) => {
//     const adminId = req.adminId;
//     const { courseId } = req.params;
//     const { title, description, price, image } = req.body;
//     try {
//         const courseSearch = await Course.findById(courseId);
//         if (!courseSearch) {
//             return res.status(404).json({ errors: "Course not found" });
//         }
//         if (!title || !description || !price) {
//             return res.status(400).json({ errors: "All fields are required" });
//         }
//         const image = req.files
//         if (!req.files || Object.keys(req.files).length === 0) {
//             return res.status(400).json({ errors: "No image file uploaded" });
//         }

//         const allowedFormat = ["image/jpeg", "image/png"];
//         if (!allowedFormat.includes(image.image.mimetype)) {
//             return res.status(400).json({ errors: "Invalid image format. Only JPEG and PNG are allowed." });
//         }

//         //cloudinary code for image upload
//         const cloud_response = await cloudinary.uploader.upload(
//             image.image.tempFilePath
//         );

//         if (!cloud_response || cloud_response.error) {
//             return res.status(400).json({
//                 errors: "Error uploading image to Cloudinary",
//             });
//         }
//         const course = await Course.findOneAndUpdate({
//             _id: courseId,
//             creatorId: adminId,
//         },
//             {
//                 title,
//                 description,
//                 price,
//                 image: {
//                     public_id: cloud_response.public_id,
//                     url: cloud_response.url,
//                 },

//             })
//         if (!course) {
//             return res.status(404).json({ errors: "Can't update, created by other admin" })
//         }
//         res.status(200).json({
//             message: "Course updated successfully",
//             course
//         });
//     } catch (error) {
//         res.status(500).json({ errors: "Error updating course" });
//         console.log("Error updating course:", error);

//     };
// };

export const updateCourse = async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        // Get params and body
        const { courseId } = req.params;

        const {
            title,
            description,
            price
        } = req.body;

        const adminId = req.adminId;

        // Find course
        const courseSearch = await Course.findById(courseId);

        if (!courseSearch) {
            return res.status(404).json({
                errors: "Course not found"
            });
        }
        // Check ownership
        console.log("Course creatorId:", courseSearch.creatorId);
        console.log("Admin ID:", adminId);
        // if (
        //     !courseSearch.creatorId || courseSearch.creatorId !==
        //     adminId
        // ) {
        //     return res.status(403).json({
        //         errors: "Unauthorized access"
        //     });
        // }

        // Upload files to Cloudinary
        const uploadFields = [
            "image",
            "pyqs",
            "notes",
            "practice"
        ];

        const uploadResults = {};

        if (req.files) {

            for (const key of uploadFields) {

                // Skip if no file uploaded
                if (!req.files[key]) {
                    continue;
                }

                const file = req.files[key][0];

                // Skip invalid file
                if (!file || !file.buffer) {
                    continue;
                }

                // image => image
                // pdf/docs => auto
                const resourceType =
                    key === "image"
                        ? "image"
                        : "auto";

                // Upload to cloudinary
                const result = await uploadToCloudinary(
                    file.buffer,
                    "course_assets",
                    resourceType
                );

                if (!result) {
                    return res.status(500).json({
                        errors: `Failed to upload ${key}`
                    });
                }

                uploadResults[key] = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            }
        }

        // Update course
        const updatedCourse = await Course.findOneAndUpdate(
            {
                _id: courseId,
                creatorId: adminId,
            },
            {
                title,
                description,
                price,

                ...(uploadResults.image && {
                    image: uploadResults.image
                }),

                ...(uploadResults.pyqs && {
                    pyqs: uploadResults.pyqs
                }),

                ...(uploadResults.notes && {
                    notes: uploadResults.notes
                }),

                ...(uploadResults.practice && {
                    practice: uploadResults.practice
                }),
            },
            {
                new: true
            }
        );

        // Response
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updatedCourse,
        });

    } catch (error) {

        console.log("UPDATE COURSE ERROR:", error);

        return res.status(500).json({
            success: false,
            errors: error.message || "Internal server error"
        });
    }
};

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,
        })
        if (!course) {
            return res.status(404).json({ errors: "Can't delete, created by other admin" });
        }
        res.status(200).json({
            message: "Course deleted successfully"
        })
    } catch (error) {
        res.status(500).json({ errors: "Error deleting course" })
        console.log("Error deleting course:", error);
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(201).json({ courses });
    }
    catch (error) {
        res.status(500).json({ errors: "Error fetching courses" });
        console.log("Error fetching courses:", error);
    }

};

export const getCourseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ error: "Error fetching course details" });
        console.log("Error fetching course details:", error);
    }
};


export const buyCourses = async (req, res) => {
    const { userId } = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ errors: "Course not found" });
        }

        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ errors: "Course already purchased" });
        }

        const newPurchase = new Purchase({
            userId: userId,
            courseId: courseId,

        });
        await newPurchase.save();

        //stripe payment code goes here!

        res.status(200).json({ message: "Course purchased successfully", newPurchase });
    } catch (error) {
        res.status(500).json({ error: "Error purchasing course" });
        console.log("Error purchasing course:", error);
    }
};

