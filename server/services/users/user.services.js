import { createClerkClient } from "@clerk/express";
import User from "../../models/user.model.js";
import { createBadRequestError, createNotFoundError } from "../../utils/appError.js";

const clerkClient = createClerkClient();

export const getAllUsers = async () => {
  return User.find()
    .select("clerkId name email role avatarUrl createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const updateUserRole = async (userId, newRole) => {
  if (!["student", "teacher", "admin"].includes(newRole)) {
    throw createBadRequestError("Invalid role. Must be student, teacher or admin.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true }
  ).select("clerkId name email role avatarUrl createdAt");

  if (!user) {
    throw createNotFoundError("User not found");
  }

  try {
    await clerkClient.users.updateUser(user.clerkId, {
      publicMetadata: { role: newRole },
    });
  } catch (error) {
    console.error("Failed to update Clerk user role:", error.message);
  }

  return user;
};
