import { createClerkClient } from "@clerk/express";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const clerkClient = createClerkClient();

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("clerkId name email role avatarUrl createdAt")
    .sort({ createdAt: -1 })
    .lean();

  successResponse(res, { data: users, message: "Users fetched successfully" });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("clerkId name email role avatarUrl createdAt");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  try {
    await clerkClient.users.updateUser(user.clerkId, {
      publicMetadata: { role },
    });
  } catch (error) {
    console.error("Failed to update Clerk user role:", error.message);
  }

  successResponse(res, { data: user, message: "User role updated successfully" });
});