import slugify from "slugify";
import Course from "../models/courses/Course.model.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listCourses = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { instructor: req.user._id };

  const courses = await Course.find(filter)
    .populate("instructor", "name avatarUrl title email")
    .populate("tags", "name slug")
    .sort({ createdAt: -1 });

  successResponse(res, { data: courses, message: "Courses fetched successfully" });
});

export const addCourse = asyncHandler(async (req, res) => {
  const slug = slugify(req.body.title, { lower: true, strict: true });

  const existing = await Course.findOne({ slug });
  if (existing) {
    throw new AppError("A course with this title or slug already exists", 400);
  }

  const course = await Course.create({
    ...req.body,
    slug,
    instructor: req.user._id,
  });

  successResponse(res, {
    statusCode: 201,
    message: "Course workspace generated successfully",
    data: course,
  });
});

export const editCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) {
    throw new AppError("Course target not found", 404);
  }

  if (req.user.role !== "admin" && !course.instructor.equals(req.user._id)) {
    throw new AppError("Unauthorised: You can only modify courses assigned to you", 403);
  }

  const updateData = { ...req.body };
  if (updateData.title) {
    updateData.slug = slugify(updateData.title, { lower: true, strict: true });
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    course._id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("instructor", "name avatarUrl title email")
    .populate("tags", "name slug");

  successResponse(res, {
    data: updatedCourse,
    message: "Course updates published successfully",
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) {
    throw new AppError("Course target not found", 404);
  }

  if (req.user.role !== "admin" && !course.instructor.equals(req.user._id)) {
    throw new AppError("Unauthorised: You can only delete courses assigned to you", 403);
  }

  await Course.findByIdAndDelete(course._id);

  successResponse(res, {
    data: { id: course._id, slug: course.slug, title: course.title },
    message: "Course deleted successfully",
  });
});