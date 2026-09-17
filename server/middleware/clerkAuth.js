import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import { createApiResponse } from "../utils/apiResponse.js";
import { createNotFoundError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json(createApiResponse(401, null, "Unauthorized"));
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    throw createNotFoundError("User not found");
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json(createApiResponse(403, null, "Access denied"));
  }
  next();
};

export default protect;