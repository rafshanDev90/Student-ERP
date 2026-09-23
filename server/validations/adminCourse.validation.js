import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .max(200, "Course title must be under 200 characters"),
  description: z.string().min(1, "Course description is required"),
  thumbnailUrl: z.string().url("Thumbnail URL must be valid").optional(),
  duration: z.string().min(1, "Course duration is required"),
  courseType: z
    .enum(["Short Course", "Full Semester", "Specialization"])
    .optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  isPopular: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });