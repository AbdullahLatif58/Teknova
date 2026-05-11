import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv"
dotenv.config();




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export function uploadToCloudinary(buffer: Buffer, folder: string, filename?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}


export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Failed to delete Cloudinary image", err);
  }
}


export function getPublicIdFromUrl(url: string): string {
 
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1]; 
  const filename = lastPart.split(".")[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename}`;
}
