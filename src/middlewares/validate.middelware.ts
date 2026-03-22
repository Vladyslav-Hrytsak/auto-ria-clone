import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";

class ValidationMiddleware {
  /**
   * ✅ Validate BODY
   */
  public validateBody(schema: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await schema.validateAsync(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

        next();
      } catch (e: any) {
        const message = e.details?.map((err: any) => err.message).join(", ");

        next(new ApiError(message || "Validation error", 400));
      }
    };
  }

  /**
   * ✅ Validate QUERY
   */
  public validateQuery(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { value, error } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const message = error.details.map((err) => err.message).join(", ");

        return next(new ApiError(message, 400));
      }

      req.query = value;
      next();
    };
  }

  /**
   * ✅ Validate PARAMS (через Joi)
   */
  public validateParams(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { value, error } = schema.validate(req.params, {
        abortEarly: false,
      });

      if (error) {
        const message = error.details.map((err) => err.message).join(", ");

        return next(new ApiError(message, 400));
      }

      req.params = value;
      next();
    };
  }
  public isIdValid(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const id = req.params[paramName];

      if (!isObjectIdOrHexString(id)) {
        return next(new ApiError(`Invalid ${paramName}`, 400));
      }

      next();
    };
  }
}

export const validationMiddleware = new ValidationMiddleware();
