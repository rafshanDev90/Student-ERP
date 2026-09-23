import crypto from "crypto";

const generateId = (prefix) => {
  const random = crypto.randomBytes(3).toString("hex");
  return `${prefix}_${random}`;
};

export const courseId = () => generateId("crs");
export const assignmentId = () => generateId("asg");
export const gradeId = () => generateId("grd");
export const examId = () => generateId("exm");
export const documentId = () => generateId("doc");
export const scheduleId = () => generateId("sched");
export const materialId = () => generateId("mat");