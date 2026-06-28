// const cloudinary = require("cloudinary").v2;
import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// module.exports = { cloudinary};

export const uploadToCloudinary = (fileBuffer, folder, resourceType = "raw") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          folder: "pdfs",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      )
      .end(fileBuffer);
  });
  console.log(cloudResponse.secure_url);
};


// module.exports = cloudinary;