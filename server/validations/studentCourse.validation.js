import { z } from "zod";

export const createCourseSchema = z.object({
  course_name: z
    .string()
    .min(1, "Course name is required")
    .max(200, "Course name must be under 200 characters"),
  course_code: z
    .string()
    .min(1, "Course code is required")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Course code may only contain letters, numbers and dashes"
    )
    .max(20, "Course code must be under 20 characters"),
  professor: z
    .string()
    .min(1, "Professor name is required")
    .max(100, "Professor name must be under 100 characters"),
  credits: z
    .number({ message: "Credits must be a number" })
    .int("Credits must be a whole number")
    .min(1, "Credits must be at least 1")
    .max(10, "Credits must be at most 10"),
});

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const addMaterialSchema = z.object({
  title: z
    .string()
    .min(1, "Material title is required")
    .max(200, "Title must be under 200 characters"),
  file_name: z.string().min(1, "File name is required"),
  file_type: z.string().min(1, "File type is required"),
  file_size_bytes: z
    .number({ message: "File size must be a number" })
    .int("File size must be a whole number")
    .positive("File size must be positive"),
  storage_url: z.string().url("Storage URL must be a valid URL"),
});