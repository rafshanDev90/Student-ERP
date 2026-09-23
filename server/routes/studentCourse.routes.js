import express from 'express';
import { z } from 'zod';
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  addMaterial,
  removeMaterial,
} from '../controllers/studentCourse.controller.js';
import { protect, authorize } from '../middleware/clerkAuth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import {
  createCourseSchema,
  updateCourseSchema,
  addMaterialSchema,
} from '../validations/studentCourse.validation.js';

const router = express.Router();

router.use(protect);

const courseParamsSchema = z.object({
  courseId: z.string().min(1, 'Course id is required'),
});

const materialParamsSchema = courseParamsSchema.extend({
  materialId: z.string().min(1, 'Material id is required'),
});

router
  .route('/')
  .get(listCourses)
  .post(
    authorize('teacher', 'admin'),
    validateBody(createCourseSchema),
    createCourse
  );

router
  .route('/:courseId')
  .get(validateParams(courseParamsSchema), getCourse)
  .put(
    validateParams(courseParamsSchema),
    authorize('teacher', 'admin'),
    validateBody(updateCourseSchema),
    updateCourse
  );

router
  .route('/:courseId/materials')
  .post(
    validateParams(courseParamsSchema),
    authorize('teacher', 'admin'),
    validateBody(addMaterialSchema),
    addMaterial
  );

router.delete(
  '/:courseId/materials/:materialId',
  validateParams(materialParamsSchema),
  authorize('teacher', 'admin'),
  removeMaterial
);

export default router;