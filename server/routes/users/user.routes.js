import express from 'express';
import { listUsers, changeUserRole } from '../../controller/user/user.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), listUsers);
router.patch('/:id/role', protect, authorize('admin'), changeUserRole);

export default router;