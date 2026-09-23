class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createBadRequestError = (message = "Bad request data") =>
  new AppError(message, 400);

export const createUnauthorizedError = (message = "Unauthorized") =>
  new AppError(message, 401);

export const createForbiddenError = (message = "Access denied") =>
  new AppError(message, 403);

export const createNotFoundError = (message = "Resource not found") =>
  new AppError(message, 404);

export default AppError;