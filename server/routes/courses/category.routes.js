import express from 'express';
import { getCategories, addCategory } from '../../controller/course/category.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('teacher', 'admin'), addCategory);

export default router;