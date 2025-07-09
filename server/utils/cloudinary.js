import { v2 as cloudinary } from 'cloudinary';
import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} from "../config/env.js";
import fs from "fs";
import {ApiError} from "../middleware/error.middleware.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'pizzas',
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // only delete if exists
    }

    console.log('File uploaded successfully:', res.secure_url);
    return res.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new ApiError(500, 'Failed to upload image to Cloudinary');
  }
};

export default uploadOnCloudinary;