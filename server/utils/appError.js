export const AppError = ( message, statusCode) =>{
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}

export const createNotFoundError = (message = 'Resource not found') => {
    return AppError(message, 404);
};

export const createBadRequestError = (message = "Bad request data") => AppError(message, 400);
export const createUnauthorizedError = (message = "Unauthorized") => AppError(message, 401);
export const createForbiddenError = (message = "Access denied") => AppError(message, 403);