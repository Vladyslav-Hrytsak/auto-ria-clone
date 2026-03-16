import { NextFunction, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { AuthRequest } from "../types/authRequest.interface";

class FileMiddleware {
  public validateImages(
    fieldName: string,
    maxCount: number = 1,
    maxSizeMb: number = 5,
  ) {
    const MAX_SIZE = maxSizeMb * 1024 * 1024;

    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.files || !req.files[fieldName]) {
        return res.status(400).json({ message: "File is required" });
      }

      const filesRaw = req.files[fieldName];

      const files: UploadedFile[] = Array.isArray(filesRaw)
        ? filesRaw
        : [filesRaw];

      if (files.length > maxCount) {
        return res.status(400).json({
          message: `Max ${maxCount} files allowed`,
        });
      }

      for (const file of files) {
        if (!file.mimetype.startsWith("image/")) {
          return res.status(400).json({
            message: "Only images are allowed",
          });
        }

        if (file.size > MAX_SIZE) {
          return res.status(400).json({
            message: `File too large. Max ${maxSizeMb}MB`,
          });
        }

        if (file.size === 0) {
          return res.status(400).json({
            message: "File is empty",
          });
        }
      }

      next();
    };
  }
}

export const fileMiddleware = new FileMiddleware();
