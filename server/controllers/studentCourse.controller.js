import StudentCourse from "../models/studentCourse.model.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { courseId, materialId } from "../utils/generateId.js";

export const listCourses = asyncHandler(async (req, res) => {
  const courses = await StudentCourse.find().sort({ created_at: -1 });

  successResponse(res, {
    data: courses,
    message: "Courses fetched successfully",
  });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await StudentCourse.findOne({ course_id: req.params.courseId });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  successResponse(res, { data: course, message: "Course fetched successfully" });
});

export const createCourse = asyncHandler(async (req, res) => {
  const { course_code } = req.body;

  const existing = await StudentCourse.findOne({ course_code });
  if (existing) {
    throw new AppError("Course code already exists", 409);
  }

  const course = await StudentCourse.create({
    course_id: courseId(),
    ...req.body,
  });

  successResponse(res, {
    statusCode: 201,
    message: "Course created successfully.",
    data: course,
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await StudentCourse.findOne({ course_id: req.params.courseId });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (req.body.course_code && req.body.course_code !== course.course_code) {
    const existing = await StudentCourse.findOne({ course_code: req.body.course_code });
    if (existing) {
      throw new AppError("Course code already exists", 409);
    }
  }

  const updated = await StudentCourse.findOneAndUpdate(
    { course_id: req.params.courseId },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  successResponse(res, {
    data: updated,
    message: "Course updated successfully.",
  });
});

export const addMaterial = asyncHandler(async (req, res) => {
  const course = await StudentCourse.findOne({ course_id: req.params.courseId });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const material = {
    material_id: materialId(),
    ...req.body,
    uploaded_by: req.user._id,
  };

  course.materials.push(material);
  await course.save();

  successResponse(res, {
    statusCode: 201,
    data: course.materials[course.materials.length - 1],
    message: "Material added successfully.",
  });
});

export const removeMaterial = asyncHandler(async (req, res) => {
  const course = await StudentCourse.findOne({ course_id: req.params.courseId });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const exists = course.materials.some(
    (m) => m.material_id === req.params.materialId
  );
  if (!exists) {
    throw new AppError("Material not found", 404);
  }

  course.materials = course.materials.filter(
    (m) => m.material_id !== req.params.materialId
  );
  await course.save();

  successResponse(res, {
    message: "Material removed successfully.",
    data: { course_id: course.course_id },
  });
});