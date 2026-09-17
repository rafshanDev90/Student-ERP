import { getAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/express";
import User from "../models/user.model.js";
import { createApiResponse } from "../utils/apiResponse.js";
import { createNotFoundError } from "../utils/appError.js";
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
 * Sync role drift: if the Clerk session token carries a role claim that
 * differs from the stored Mongo user, adopt it (e.g. role changed in the
 * Clerk Dashboard but the webhook hasn't fired yet).
 */
const syncRoleDrift = async (user, sessionClaims) => {
  const claimedRole = sessionClaims?.metadata?.role;
  if (claimedRole && claimedRole !== user.role) {
    user.role = claimedRole;
    await user.save();
  }
};

export const protect = asyncHandler(async (req, res, next) => {
  const { userId } = getAuth(req);

  // ---- DEV DIAGNOSTICS -------------------------------------------------
  const authHeader = req.headers.authorization || "";
  const rawToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  console.log("[AUTH] " + new Date().toISOString());
  console.log("[AUTH] path:", req.method, req.originalUrl);
  if (rawToken) {
    console.log("[AUTH] raw token:", rawToken);
  } else {
    console.log("[AUTH] raw token: <none>");
  }
  console.log("[AUTH] clerk userId:", userId ?? "<none>");
  console.log(
    "[AUTH] sessionClaims.metadata:",
    JSON.stringify(getAuth(req).sessionClaims?.metadata ?? null)
  );
  // ----------------------------------------------------------------------

  if (!userId) {
    return res.status(401).json(createApiResponse(401, null, "Unauthorized"));
  }

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    try {
      user = await upsertClerkUser(userId);
    } catch (error) {
      console.error("Failed to sync Clerk user:", error.message);
      throw createNotFoundError("User not found");
    }
  } else {
    await syncRoleDrift(user, getAuth(req).sessionClaims);
  }

  console.log(
    "[AUTH] DB user:",
    JSON.stringify({
      clerkId: user?.clerkId,
      email: user?.email,
      role: user?.role,
    })
  );

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