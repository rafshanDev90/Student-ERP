import express from "express";
import protect from "../middleware/clerkAuth.js";
import { successResponse } from "../utils/apiResponse.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  successResponse(res, { data: req.user });
});

export default router;