import { createNewCourse, updateCourseDetails, deleteCourseDetails } from "../../services/courses/admincourse.services.js";
import { createApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * POST /api/v1/admin/courses
 * Create Course entry
 */
export const addCourse = asyncHandler(async (req, res) => {
  // req.auth.userId contains the secure Clerk user ID string
  const course = await createNewCourse(req.body, req.auth.userId);

  return res.status(201).json(createApiResponse(201, course, 'Course workspace generated successfully'));
});

/**
 * PUT /api/v1/admin/courses/:slug
 * Update Course properties
 */
export const editCourse = asyncHandler(async (req, res) => {
  const userRole = req.auth.sessionClaims?.metadata?.role || 'student';

  const updatedCourse = await updateCourseDetails(
    req.params.slug,
    req.body,
    req.auth.userId,
    userRole
  );

  return res.status(200).json(createApiResponse(200, updatedCourse, 'Course updates published successfully'));
});

/**
 * DELETE /api/v1/admin/courses/:slug
 * Delete Course entry
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const userRole = req.auth.sessionClaims?.metadata?.role || 'student';

  const deletedCourse = await deleteCourseDetails(
    req.params.slug,
    req.auth.userId,
    userRole
  );

  return res.status(200).json(createApiResponse(200, deletedCourse, 'Course deleted successfully'));
});