import express from 'express';
import {
  listUsers,
  changeUserRole,
} from '../../controllers/user.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { changeUserRoleSchema } from '../../validations/user.validation.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), listUsers);
router.patch(
  '/:id/role',
  protect,
  authorize('admin'),
  validateBody(changeUserRoleSchema),
  changeUserRole
);

export default router;