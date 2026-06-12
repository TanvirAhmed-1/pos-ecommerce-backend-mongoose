import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { uploadToCloudinary } from "../../utils/cloudinary";
import AppError from "../../errors/AppError";

const uploadSingle = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload an image file!");
  }

  const folder = (req.body.folder || req.query.folder || "uploads") as string;
  const result = await uploadToCloudinary(req.file.buffer, folder);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Image uploaded and compressed successfully",
    data: {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    },
  });
});

const uploadMultiple = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload at least one image file!");
  }

  const folder = (req.body.folder || req.query.folder || "uploads") as string;

  const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, folder));
  const uploadResults = await Promise.all(uploadPromises);

  const data = uploadResults.map((result) => ({
    url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    bytes: result.bytes,
  }));

  res.status(httpStatus.OK).json({
    success: true,
    message: "Images uploaded and compressed successfully",
    data,
  });
});

export const UploadController = {
  uploadSingle,
  uploadMultiple,
};
