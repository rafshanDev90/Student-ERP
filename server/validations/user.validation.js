import { z } from "zod";

export const changeUserRoleSchema = z.object({
  role: z.enum(["student", "teacher", "admin"], {
    message: "Role must be student, teacher or admin",
  }),
});