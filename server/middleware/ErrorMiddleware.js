/**This middleware function is a centralized error handler for an Express.js API.
Its primary purpose is to intercept any errors thrown in your routes or other 
middleware, log them on the server side for debugging, and return a clean, structured 
JSON response to the client. */


//Express recognizes this function as an error-handling middleware because it accepts exactly four parameters
export const errorMiddleware = ( err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
    const message = err.message || 'Internal Server Error'; // Default message

    // Log the error details to the server console for debugging purposes
    console.error(`Error: ${message}, Status Code: ${statusCode}, Stack: ${err.stack}`);

    // Send a structured JSON response to the client
    res.status(statusCode).json({
        success: false,
        message: message,
        // Optionally include the stack trace in development mode for easier debugging
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}