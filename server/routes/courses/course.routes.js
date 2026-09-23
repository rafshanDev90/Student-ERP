import express from 'express';
import {
  getCourses,
  getFeatured,
  getCourseDetails,
} from '../../controllers/course.controller.js';
import {
  addCourse,
  editCourse,
  deleteCourse,
} from '../../controllers/adminCourse.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';
import {
  validateBody,
  validateParams,
} from '../../middleware/validate.js';
import { z } from 'zod';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../../validations/adminCourse.validation.js';

const router = express.Router();

const courseParamsSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

router.get('/', getCourses);
router.get('/featured', getFeatured);
router.get(
  '/:slug',
  validateParams(courseParamsSchema),
  getCourseDetails
);

router.post(
  '/',
  protect,
  authorize('teacher', 'admin'),
  validateBody(createCourseSchema),
  addCourse
);
router.put(
  '/:slug',
  protect,
  authorize('teacher', 'admin'),
  validateParams(courseParamsSchema),
  validateBody(updateCourseSchema),
  editCourse
);
router.delete(
  '/:slug',
  protect,
  authorize('teacher', 'admin'),
  validateParams(courseParamsSchema),
  deleteCourse
);

export default router;