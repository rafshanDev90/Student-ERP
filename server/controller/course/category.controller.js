import { getAllCategories, createCategory } from '../../services/courses/category.services.js';
import { createApiResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();

  return res.status(200).json(createApiResponse(200, categories, 'Categories fetched successfully'));
});

export const addCategory = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);

  return res.status(201).json(createApiResponse(201, category, 'Category created successfully'));
});