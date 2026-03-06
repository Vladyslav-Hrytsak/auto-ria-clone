import { ApiError } from "../errors/api-error";

export const getTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Invalid authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError("Token not provided", 401);
  }

  return token;
};
