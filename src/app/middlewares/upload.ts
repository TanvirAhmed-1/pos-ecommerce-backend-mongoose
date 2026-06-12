import multer from "multer";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(httpStatus.BAD_REQUEST, "Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: fileFilter,
});

export const uploadSingleImage = (fieldName: string) => {
  const uploadMiddleware = upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new AppError(httpStatus.BAD_REQUEST, "Image size exceeds the 2MB limit!"));
          }
          return next(new AppError(httpStatus.BAD_REQUEST, err.message));
        }
        return next(err);
      }
      next();
    });
  };
};

export const uploadMultipleImages = (fieldName: string, maxCount: number = 10) => {
  const uploadMiddleware = upload.array(fieldName, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new AppError(httpStatus.BAD_REQUEST, "One or more images exceed the 2MB size limit!"));
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(new AppError(httpStatus.BAD_REQUEST, `Too many files. Max allowed is ${maxCount}.`));
          }
          return next(new AppError(httpStatus.BAD_REQUEST, err.message));
        }
        return next(err);
      }
      next();
    });
  };
};

/**
 * Middleware to upload a single image, compress it, upload to Cloudinary,
 * and attach the URL to req.body under the specified field name.
 */
export const uploadAndAttachSingle = (
  fieldName: string,
  bodyFieldName: string,
  folderName: string = "uploads"
) => {
  const fileMiddleware = uploadSingleImage(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    fileMiddleware(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      if (req.file) {
        try {
          const uploadResult = await uploadToCloudinary(req.file.buffer, folderName);
          req.body[bodyFieldName] = uploadResult.secure_url;
        } catch (uploadError) {
          return next(uploadError);
        }
      }

      next();
    });
  };
};

/**
 * Middleware to upload multiple images, compress them, upload to Cloudinary,
 * and attach the array of URLs to req.body under the specified field name.
 */
export const uploadAndAttachMultiple = (
  fieldName: string,
  bodyFieldName: string,
  folderName: string = "uploads",
  maxCount: number = 10
) => {
  const fileMiddleware = uploadMultipleImages(fieldName, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    fileMiddleware(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        try {
          const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
            uploadToCloudinary(file.buffer, folderName)
          );
          const uploadResults = await Promise.all(uploadPromises);
          req.body[bodyFieldName] = uploadResults.map((result) => result.secure_url);
        } catch (uploadError) {
          return next(uploadError);
        }
      }

      next();
    });
  };
};

/**
 * Middleware to parse string numbers and booleans inside req.body
 * that are sent as multipart/form-data. This ensures Zod validations pass.
 */
export const parseMultipartBody = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    // Convert stringified numbers to actual numbers
    const numberFields = [
      "basePrice",
      "salePrice",
      "vat",
      "totalStock",
      "costPrice",
      "regularPrice",
      "resellerPrice",
      "discountPrice",
      "productDiscount",
    ];
    numberFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        const parsed = Number(req.body[field]);
        if (!isNaN(parsed)) {
          req.body[field] = parsed;
        }
      }
    });

    // Convert stringified booleans to actual booleans
    const booleanFields = [
      "hasVariants",
      "isActive",
      "isFeatured",
      "isTrending",
      "isBestSeller",
      "isNewArrival",
    ];
    booleanFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        if (req.body[field] === "true") req.body[field] = true;
        if (req.body[field] === "false") req.body[field] = false;
      }
    });

    // Parse stringified JSON arrays (like images or SEO keywords)
    if (req.body.images && typeof req.body.images === "string") {
      try {
        req.body.images = JSON.parse(req.body.images);
      } catch (e) {
        // If it's not valid JSON, but a single url string, convert to array
        if (req.body.images.startsWith("http")) {
          req.body.images = [req.body.images];
        }
      }
    }

    if (req.body.seo && typeof req.body.seo === "string") {
      try {
        req.body.seo = JSON.parse(req.body.seo);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }

    if (req.body.socialMedia && typeof req.body.socialMedia === "string") {
      try {
        req.body.socialMedia = JSON.parse(req.body.socialMedia);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
  }
  next();
};

/**
 * Middleware to handle product multipart file uploads (thumbnail and images field)
 * and attach their Cloudinary URLs to req.body.
 */
export const uploadProductFiles = () => {
  const fileFilter = (_req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError(httpStatus.BAD_REQUEST, "Only image files are allowed!"), false);
    }
  };

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: fileFilter,
  });

  const uploadFields = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadFields(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new AppError(httpStatus.BAD_REQUEST, "One or more files exceed the 2MB size limit!"));
          }
          return next(new AppError(httpStatus.BAD_REQUEST, err.message));
        }
        return next(err);
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      try {
        if (files) {
          // 1. Process thumbnail
          if (files.thumbnail && files.thumbnail.length > 0) {
            const result = await uploadToCloudinary(files.thumbnail[0].buffer, "products");
            req.body.thumbnail = result.secure_url;
          }

          // 2. Process images array
          if (files.images && files.images.length > 0) {
            const uploadPromises = files.images.map((file) =>
              uploadToCloudinary(file.buffer, "products")
            );
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map((r) => r.secure_url);

            // Merge with any existing images already in req.body (e.g. from JSON payload)
            const existingUrls = Array.isArray(req.body.images) ? req.body.images : [];
            req.body.images = [...existingUrls, ...newUrls];
          }
        }
        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
};

/**
 * Middleware to handle company multipart file uploads (logo and favicon fields)
 * and attach their Cloudinary URLs to req.body.
 */
export const uploadCompanyFiles = () => {
  const fileFilter = (_req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError(httpStatus.BAD_REQUEST, "Only image files are allowed!"), false);
    }
  };

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: fileFilter,
  });

  const uploadFields = upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadFields(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new AppError(httpStatus.BAD_REQUEST, "One or more files exceed the 2MB size limit!"));
          }
          return next(new AppError(httpStatus.BAD_REQUEST, err.message));
        }
        return next(err);
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      try {
        if (files) {
          // 1. Process logo
          if (files.logo && files.logo.length > 0) {
            const result = await uploadToCloudinary(files.logo[0].buffer, "company");
            req.body.logo = result.secure_url;
          }

          // 2. Process favicon
          if (files.favicon && files.favicon.length > 0) {
            const result = await uploadToCloudinary(files.favicon[0].buffer, "company");
            req.body.favicon = result.secure_url;
          }
        }
        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
};




