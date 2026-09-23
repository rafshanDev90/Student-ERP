import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    material_id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    file_name: { type: String, required: true },
    file_type: { type: String, required: true },
    file_size_bytes: { type: Number, required: true, min: 0 },
    storage_url: { type: String, required: true },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const studentCourseSchema = new mongoose.Schema(
  {
    course_id: { type: String, required: true, unique: true },
    course_name: { type: String, required: true, trim: true },
    course_code: { type: String, required: true, unique: true, uppercase: true },
    professor: { type: String, required: true },
    credits: { type: Number, required: true, min: 1, max: 10 },
    materials: { type: [materialSchema], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("StudentCourse", studentCourseSchema);