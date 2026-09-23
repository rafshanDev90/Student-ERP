import AppError from "../utils/AppError.js";
import { errorResponse } from "../utils/apiResponse.js";

const isMongooseValidationError = (err) => err.name === "ValidationError";
const isMongooseCastError = (err) => err.name === "CastError";
const hasHttpStatus = (err) =>
  Number.isInteger(err.statusCode) &&
  err.statusCode >= 400 &&
  err.statusCode < 600;

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (isMongooseValidationError(err)) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (isMongooseCastError(err)) {
    statusCode = 400;
    message = "Invalid identifier in request";
  } else if (hasHttpStatus(err)) {
    // Errors from third-party middleware that already carry an HTTP status.
    statusCode = err.statusCode;
    message = err.message || "Request failed";
  } else {
    // Programming errors get logged with the stack, users get a generic message.
    console.error(`[ERROR] ${req.method} ${req.originalUrl}: ${err.stack}`);
  }

  const payload = { statusCode, message, data: null };
  if (process.env.NODE_ENV === "development") {
    payload.stack = err.stack;
  }

  return errorResponse(res, payload);
};