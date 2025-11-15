import {v2 as cloudinary} from "cloudinary"
import response from "express";
import fs from "fs";import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("Cloudinary name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("Cloudinary api_key:", process.env.CLOUDINARY_API_KEY);
// console.log("Cloudinary api_secret:", process.env.CLOUDINARY_API_SECRET);

// const uploadOnCloudinary =async (localFilePath) => {
//     try{
//         if(!localFilePath) return null
//        const response = await cloudinary.uploader.upload(localFilePath ,{
//           // format:"auto", 
//             resource_type:"auto"
//         })
//         //file has been uploaded
//         console.log("Uploading to Cloudinary:", localFilePath);

//         return response;
//     }catch(error){
//    fs.unlinkSync(localFilePath)// remove the locally saved file 
//    return null;
//     }
// }

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("Uploading to Cloudinary:", localFilePath);

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); // cleanup local file after upload
    console.log("Upload success:", result.url);

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};




export default uploadOnCloudinary;