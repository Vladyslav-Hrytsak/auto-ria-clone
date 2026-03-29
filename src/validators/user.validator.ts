import Joi from "joi";
import {OrderEnum} from "../enums/order.enum";
import {AccountType} from "../enums/accountType.enum";
import {UserOrderByEnum} from "../enums/user-order-by.enum";

export const registerValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9]{3,10}$/)
    .required()
    .messages({
      "string.min": "The password must be at least 3 characters long.",
      "string.pattern.base":
        "The password can only contain Latin letters and numbers.",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+380\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be in format +380XXXXXXXXX",
      "any.required": "Phone number is required",
    }),

  name: Joi.string().min(4).required().messages({
    "string.min": "name is too short",
    "any.required": "name is not empty",
  }),
});
export const loginValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9]{3,10}$/)
    .required()
    .messages({
      "string.min": "The password must be at least 3 characters long.",
      "string.pattern.base":
        "The password can only contain Latin letters and numbers.",
    }),
});

export const changePassword = Joi.object({
  password: Joi.string()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9]{3,10}$/)
    .required()
    .messages({
      "string.min": "The password must be at least 3 characters long.",
      "string.pattern.base":
        "The password can only contain Latin letters and numbers.",
    }),
});

export const changePasswordFromUser = Joi.object({
  password: Joi.string()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9]{3,10}$/)
    .required()
    .messages({
      "string.min": "The password must be at least 3 characters long.",
      "string.pattern.base":
        "The password can only contain Latin letters and numbers.",
    }),
  newPassword: Joi.string()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9]{3,10}$/)
    .required()
    .messages({
      "string.min": "The password must be at least 3 characters long.",
      "string.pattern.base":
        "The password can only contain Latin letters and numbers.",
    }),
});

export const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

export const deletePhotoValidator = Joi.object({
  url: Joi.string().required(),
});

export const userQueryValidator = Joi.object({
  limit: Joi.number().min(1).max(100).default(10),
  page: Joi.number().min(1).default(1),

  search: Joi.string().trim().lowercase(),
  accountType: Joi.string().valid(...Object.values(AccountType)),
  isBanned: Joi.boolean(),

  order: Joi.string()
    .valid(...Object.values(OrderEnum))
    .default(OrderEnum.DESC),
  orderBy: Joi.string()
    .valid(...Object.values(UserOrderByEnum))
    .default(UserOrderByEnum.CREATED_AT),
});
