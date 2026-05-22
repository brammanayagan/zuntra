import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Uploads a file buffer to Cloudinary or saves it locally if Cloudinary is not configured.
 * @param {Buffer} fileBuffer - The file buffer from multer memory storage
 * @param {string} originalName - Original uploaded filename
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<string>} The URL or relative path of the uploaded image
 */
export const uploadImage = async (fileBuffer, originalName, mimeType) => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pinstack_pins",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(new Error("Cloudinary upload failed: " + error.message));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } else {
    // FALLBACK: Local disk storage
    try {
      const ext = path.extname(originalName) || `.${mimeType.split("/")[1]}`;
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const localFilePath = path.join(__dirname, "..", "uploads", uniqueFilename);

      // Save file buffer to local disk
      await fs.promises.writeFile(localFilePath, fileBuffer);
      console.log(`Fallback: Upload saved locally to /uploads/${uniqueFilename}`);
      
      // Return relative route path (frontend will concatenate backend API URL)
      return `/uploads/${uniqueFilename}`;
    } catch (error) {
      console.error("Local Upload Fallback Error:", error);
      throw new Error("Local file upload fallback failed: " + error.message);
    }
  }
};
