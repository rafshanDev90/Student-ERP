import { z } from "zod";

const booleanFromString = z.preprocess(
  (value) => (value === "true" ? true : value === "false" ? false : value),
  z.boolean()
);

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .max(200, "Course title must be under 200 characters"),
  description: z.string().min(1, "Course description is required"),
  imageUrl: z.string().optional(),
  duration: z.string().min(1, "Course duration is required"),
  courseType: z
    .enum(["Short Course", "Full Semester", "Specialization"])
    .optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  isPopular: booleanFromString.optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });