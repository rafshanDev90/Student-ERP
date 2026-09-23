import { getAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/express";
import User from "../models/user.model.js";
import AppError, { createNotFoundError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const clerkClient = createClerkClient();

/**
 * Fallback sync: when a Clerk session is valid but the user is missing
 * from MongoDB (e.g. webhook not configured or user created before it),
 * fetch the user from Clerk and upsert the Mongo record.
 */
const upsertClerkUser = async (clerkId) => {
  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ||
    clerkUser.emailAddresses?.[0]?.emailAddress ||
    "";

  return User.findOneAndUpdate(
    { clerkId },
    {
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" "),
      avatarUrl: clerkUser.imageUrl || "",
      role: clerkUser.publicMetadata?.role || "student",
    },
    { new: true, upsert: true, runValidators: true }
  );
};

/**
 * Adopt role changes from the Clerk session claims that have not yet
 * reached MongoDB via the webhook (e.g. role changed in Clerk Dashboard).
 */
const syncRoleDrift = async (user, sessionClaims) => {
  const claimedRole = sessionClaims?.metadata?.role;
  if (claimedRole && claimedRole !== user.role) {
    user.role = claimedRole;
    await user.save();
  }
};

export const protect = asyncHandler(async (req, res, next) => {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId) {
    return next(new AppError("Unauthorized", 401));
  }

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    try {
      user = await upsertClerkUser(userId);
    } catch (error) {
      console.error("Failed to sync Clerk user:", error.message);
      return next(createNotFoundError("User not found"));
    }
  } else {
    await syncRoleDrift(user, sessionClaims);
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Access denied", 403));
  }
  next();
};

export default protect;