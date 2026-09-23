import slugify from "slugify";
import Category from "../models/courses/Category.model.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  successResponse(res, {
    data: categories,
    message: "Categories fetched successfully",
  });
});

export const addCategory = asyncHandler(async (req, res) => {
  const slug = slugify(req.body.name, { lower: true, strict: true });

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new AppError("A category with this name already exists", 400);
  }

  const category = await Category.create({ ...req.body, slug });
  successResponse(res, {
    statusCode: 201,
    data: category,
    message: "Category created successfully",
  });
});