import { NextFunction, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { AuthRequest } from "../types/authRequest.interface";

class FileMiddleware {
  public isFileValid(maxSizeMb: number = 5) {
    const MAX_SIZE = maxSizeMb * 1024 * 1024;

    return (req: AuthRequest, res: Response, next: NextFunction) => {
      console.log(req.files);
      if (!req.files || !req.files.avatar) {
        return res.status(400).json({ message: "File is required" });
      }

      const avatar = req.files.avatar as UploadedFile;

      if (!avatar.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only images are allowed" });
      }

      if (avatar.size > MAX_SIZE) {
        return res.status(400).json({
          message: `File is too large. Max size is ${maxSizeMb}MB`,
        });
      }

      if (avatar.size === 0) {
        return res.status(400).json({ message: "File is empty" });
      }

      next();
    };
  }
}

export const fileMiddleware = new FileMiddleware();
