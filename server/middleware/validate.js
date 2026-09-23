import AppError from "../utils/AppError.js";

const formatZodError = (error) =>
  error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new AppError(formatZodError(result.error), 400));
  }
  req.body = result.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return next(new AppError(formatZodError(result.error), 400));
  }
  req.params = result.data;
  next();
};