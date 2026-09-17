import Category from '../../models/courses/Category.model.js';
import { createBadRequestError } from '../../utils/appError.js';
import slugify from 'slugify';

export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const createCategory = async ({ name, description }) => {
  const slug = slugify(name, { lower: true, strict: true });

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw createBadRequestError('A category with this name already exists');
  }

  return await Category.create({ name, description, slug });
};