import { getAllUsers, updateUserRole } from "../../services/users/user.services.js";
import { createApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * GET /api/admin/users
 * Admin-only list of all users.
 */
export const listUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  return res.status(200).json(createApiResponse(200, users, "Users fetched successfully"));
});

/**
 * PATCH /api/admin/users/:id/role
 * Admin-only role update (MongoDB + Clerk public metadata).
 */
export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await updateUserRole(id, role);
  return res.status(200).json(createApiResponse(200, user, "User role updated successfully"));
});