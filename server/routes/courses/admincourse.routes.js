import express from 'express';
import {
  listCourses,
  addCourse,
  editCourse,
  deleteCourse,
} from '../../controllers/adminCourse.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';
import { validateBody } from '../../middleware/validate.js';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../../validations/adminCourse.validation.js';

const router = express.Router();

router.get('/courses', protect, authorize('teacher', 'admin'), listCourses);
router.post(
  '/courses',
  protect,
  authorize('teacher', 'admin'),
  validateBody(createCourseSchema),
  addCourse
);
router.put(
  '/courses/:slug',
  protect,
  authorize('teacher', 'admin'),
  validateBody(updateCourseSchema),
  editCourse
);
router.delete(
  '/courses/:slug',
  protect,
  authorize('teacher', 'admin'),
  deleteCourse
);

export default router;