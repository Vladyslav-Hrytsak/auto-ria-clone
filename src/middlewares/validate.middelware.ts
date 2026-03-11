import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { ApiError } from "../errors/api-error";

class ValidateMiddleware {
  public isIdValid(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const errorMessage = error.details
          .map((detail) => detail.message)
          .join(",\n ");

        return next(new ApiError(errorMessage, 400));
      }
      next();
    };
  }
}

export const validateMiddleware = new ValidateMiddleware();
