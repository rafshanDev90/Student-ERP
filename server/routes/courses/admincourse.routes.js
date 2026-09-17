import express from 'express';
import { listCourses, addCourse, editCourse, deleteCourse } from '../../controller/course/admincourse.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';

const router = express.Router();

router.get('/courses', protect, authorize('teacher', 'admin'), listCourses);
router.post('/courses', protect, authorize('teacher', 'admin'), addCourse);
router.put('/courses/:slug', protect, authorize('teacher', 'admin'), editCourse);
router.delete('/courses/:slug', protect, authorize('teacher', 'admin'), deleteCourse);

export default router;