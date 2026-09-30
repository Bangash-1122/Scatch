import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || (error.name === "ValidationError" ? 400 : 500);
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    // Handle Mongoose Bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid field: ${err.path}`;
        error = new ApiError(404, message);
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        const message = `Duplicate value entered for ${field}. Please use another value`;
        error = new ApiError(409, message);
    }

    // Handle JWT Error
    if (err.name === "JsonWebTokenError") {
        error = new ApiError(401, "Invalid token. Please login again.");
    }

    // Handle JWT Expired Error
    if (err.name === "TokenExpiredError") {
        error = new ApiError(401, "Token has expired. Please login again.");
    }

    const response = {
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: error.errors || []
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = error.stack;
    }

    return res.status(error.statusCode).json(response);
};
