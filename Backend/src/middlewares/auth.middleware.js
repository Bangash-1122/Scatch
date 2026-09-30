import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.cookies?.token ||
            req.header("Authorization")?.replace(/^Bearer\s+/i, "")?.trim();

        if (!token) {
            throw new ApiError(401, "Unauthorized access, token missing");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid token, user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid or expired access token");
    }
});

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }

    if (req.user.role !== "admin" && req.user.role !== "owner") {
        throw new ApiError(403, "Access forbidden: Owner or Admin rights required");
    }

    next();
});

export const optionalAuth = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.cookies?.token ||
            req.header("Authorization")?.replace(/^Bearer\s+/i, "")?.trim();

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded?._id).select("-password -refreshToken");
            if (user) {
                req.user = user;
            }
        }
    } catch {
        // Silently continue for optional authentication
    }
    next();
});