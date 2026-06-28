import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

import courseRoutes from './routes/course_route.js';
import userRoutes from './routes/user_route.js';
import adminRoutes from './routes/admin_route.js';

// import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//file upload in express code
// app.use(        
//     fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
//   })
// );
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowHeaders: ['Content-Type', 'Authorization'], // Allowed headers

})
);

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log('Connected to MongoDB');
} catch (error) {
  console.log('Error connecting to MongoDB:', error);
}

//defining the routess
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/admin",adminRoutes);

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "courses",
    });
    return result;
  } catch (error) {
    console.log("Cloudinary Error:", error);
    throw error;
  }
};


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


app.listen(port, () => {
  console.log(`server is running  on port ${port}`)
})
