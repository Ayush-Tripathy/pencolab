// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Get status code and error message
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || "Internal Server Error.";

    // Send the error response
    res.status(statusCode).json(
        {
            status: 'error',
            statusCode: statusCode,
            message: errorMessage
        });
};


module.exports = errorHandler;