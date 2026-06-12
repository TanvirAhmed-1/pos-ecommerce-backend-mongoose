import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import sharp from "sharp";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

/**
 * Compresses an image buffer using sharp and uploads it to Cloudinary as webp.
 * 
 * @param fileBuffer The original image buffer.
 * @param folder The folder in Cloudinary to upload the image to.
 * @param fileName Optional custom public_id for the file.
 * @returns UploadApiResponse from Cloudinary.
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "uploads",
  fileName?: string
): Promise<UploadApiResponse> => {
  if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Cloudinary credentials are not configured in environment variables. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  try {
    // Compress and convert to webp format with 80% quality
    // Max width set to 1200px, aspect ratio preserved
    const compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          public_id: fileName,
          format: "webp",
        },
        (error, result) => {
          if (error) {
            return reject(new AppError(httpStatus.BAD_REQUEST, `Cloudinary upload failed: ${error.message}`));
          }
          if (!result) {
            return reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Cloudinary upload failed, result is undefined"));
          }
          resolve(result);
        }
      );
      
      uploadStream.end(compressedBuffer);
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Image processing failed: ${error.message || error}`
    );
  }
};

/**
 * Extracts Cloudinary public_id from a secure/insecure Cloudinary URL.
 * Supports URLs with version numbers (e.g. /v1624567890/).
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let pathAfterUpload = parts[1];
    // Remove the version segment (e.g. "v12345678/") if it exists
    if (pathAfterUpload.startsWith("v")) {
      const firstSlashIndex = pathAfterUpload.indexOf("/");
      if (firstSlashIndex !== -1) {
        pathAfterUpload = pathAfterUpload.substring(firstSlashIndex + 1);
      }
    }

    // Remove the file extension (e.g. ".webp", ".jpg", etc.)
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload;
  } catch (error) {
    return null;
  }
};

/**
 * Deletes an image from Cloudinary by its URL.
 */
export const deleteFromCloudinary = async (url: string): Promise<any> => {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return null;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(new AppError(httpStatus.BAD_REQUEST, `Failed to delete image from Cloudinary: ${error.message}`));
      }
      resolve(result);
    });
  });
};

