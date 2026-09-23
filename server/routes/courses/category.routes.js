import express from 'express';
import {
  getCategories,
  addCategory,
} from '../../controllers/category.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { createCategorySchema } from '../../validations/category.validation.js';

const router = express.Router();

router.get('/', getCategories);
router.post(
  '/',
  protect,
  authorize('teacher', 'admin'),
  validateBody(createCategorySchema),
  addCategory
);

export default router;