import { getAllCourses, getFeaturedCourses, getCourseBySlug } from '../../services/courses/course.services.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createApiResponse } from '../../utils/apiResponse.js';

/**
 * GET /api/v1/courses
 * Public catalog access with filters
 */
export const getCourses = asyncHandler(async (req, res) => {
  const result = await getAllCourses(req.query);

  return res.status(200).json(createApiResponse(200, {
    count: result.courses.length,
    pagination: {
      totalCourses: result.total,
      currentPage: result.page,
      totalPages: result.pages
    },
    courses: result.courses
  }));
});

/**
 * GET /api/v1/courses/featured
 * Top popular items banner endpoint
 */
export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await getFeaturedCourses();

  return res.status(200).json(createApiResponse(200, featured, 'Featured courses fetched successfully'));
});

/**
 * GET /api/v1/courses/:slug
 * Single course profile layout
 */
export const getCourseDetails = asyncHandler(async (req, res) => {
  const course = await getCourseBySlug(req.params.slug);

  return res.status(200).json(createApiResponse(200, course, 'Course fetched successfully'));
});