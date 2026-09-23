import Course from "../models/courses/Course.model.js";
import Category from "../models/courses/Category.model.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCourses = asyncHandler(async (req, res) => {
  const { search, level, type, tag, page = 1, limit = 10 } = req.query;

  const query = { status: "published" };
  if (search) query.$text = { $search: search };
  if (level) query.level = level;
  if (type) query.courseType = type;

  if (tag) {
    const category = await Category.findOne({ slug: String(tag).toLowerCase() });
    if (category) {
      query.tags = category._id;
    } else {
      return successResponse(res, {
        data: { count: 0, pagination: { total: 0, page: +page, totalPages: 0 }, courses: [] },
      });
    }
  }

  const skip = (+page - 1) * +limit;

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate("instructor", "name avatarUrl title")
      .populate("tags", "name slug")
      .skip(skip)
      .limit(+limit)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 }),
    Course.countDocuments(query),
  ]);

  successResponse(res, {
    data: {
      count: courses.length,
      pagination: { total, currentPage: +page, totalPages: Math.ceil(total / +limit) },
      courses,
    },
  });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await Course.find({
    isPopular: true,
    status: "published",
  })
    .populate("instructor", "name avatarUrl title")
    .populate("tags", "name slug")
    .limit(4);

  successResponse(res, { data: featured, message: "Featured courses fetched successfully" });
});

export const getCourseDetails = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, status: "published" })
    .populate("instructor", "name avatarUrl title bio")
    .populate("tags", "name slug");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  successResponse(res, { data: course, message: "Course fetched successfully" });
});