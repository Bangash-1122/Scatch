import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

// Helper: Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found for token generation");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error?.message || "Token generation failed");
    }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, fullname, email, username, password, role, contact, address } = req.body;

    const actualFullName = (fullName || fullname || "").trim();
    const actualEmail = (email || "").trim().toLowerCase();
    let actualUsername = (username || "").trim().toLowerCase();

    if (!actualFullName || !actualEmail || !password) {
        throw new ApiError(400, "Full name, email, and password are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Auto-generate username if not provided
    if (!actualUsername) {
        const emailPrefix = actualEmail.split("@")[0].replace(/[^a-z0-9]/gi, "");
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        actualUsername = `${emailPrefix}${randomSuffix}`;
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username: actualUsername }, { email: actualEmail }]
    });

    if (existedUser) {
        if (existedUser.email === actualEmail) {
            throw new ApiError(409, "User with this email already exists");
        }
        throw new ApiError(409, "Username already taken, please choose another");
    }

    const assignedRole = role === "admin" || role === "owner" ? role : "user";

    const user = await User.create({
        fullName: actualFullName,
        email: actualEmail,
        username: actualUsername,
        password,
        role: assignedRole,
        contact: contact || "",
        address: address || ""
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                { user: createdUser, accessToken, refreshToken },
                "User registered successfully"
            )
        );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    const identifier = (email || username || "").trim().toLowerCase();

    if (!identifier) {
        throw new ApiError(400, "Email or username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist with this credential");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

// Owner / Admin Login
const ownerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    // If user does not exist yet and it's the owner attempting login, we can auto-create the owner
    if (!user) {
        const username = cleanEmail.split("@")[0] + "_owner";
        user = await User.create({
            fullName: "Store Owner",
            email: cleanEmail,
            username,
            password,
            role: "owner"
        });
    } else {
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid owner credentials");
        }

        // Ensure user has owner/admin role
        if (user.role !== "owner" && user.role !== "admin") {
            user.role = "owner";
            await user.save({ validateBeforeSave: false });
        }
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const ownerData = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: ownerData, accessToken, refreshToken },
                "Owner logged in successfully"
            )
        );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    if (req.user?._id) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or has been used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Get Current User Profile
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// Update Account Details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, contact, address } = req.body;

    if (!fullName && !contact && !address) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const updates = {};
    if (fullName) updates.fullName = fullName.trim();
    if (contact !== undefined) updates.contact = contact.trim();
    if (address !== undefined) updates.address = address.trim();

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updates },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

// Change Current Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long");
    }

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// User Cart Operations
const getUserCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("cart.product");
    return res
        .status(200)
        .json(new ApiResponse(200, user.cart || [], "Cart retrieved successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
        user.cart[existingIndex].quantity += Number(quantity);
    } else {
        user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    await user.save({ validateBeforeSave: false });
    const populatedUser = await User.findById(user._id).populate("cart.product");

    return res
        .status(200)
        .json(new ApiResponse(200, populatedUser.cart, "Item added to cart"));
});

const updateCartQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        throw new ApiError(400, "Product ID and quantity are required");
    }

    const user = await User.findById(req.user._id);

    if (Number(quantity) <= 0) {
        user.cart = user.cart.filter(
            (item) => item.product.toString() !== productId.toString()
        );
    } else {
        const item = user.cart.find(
            (item) => item.product.toString() === productId.toString()
        );
        if (item) {
            item.quantity = Number(quantity);
        }
    }

    await user.save({ validateBeforeSave: false });
    const populatedUser = await User.findById(user._id).populate("cart.product");

    return res
        .status(200)
        .json(new ApiResponse(200, populatedUser.cart, "Cart quantity updated"));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId.toString()
    );

    await user.save({ validateBeforeSave: false });
    const populatedUser = await User.findById(user._id).populate("cart.product");

    return res
        .status(200)
        .json(new ApiResponse(200, populatedUser.cart, "Item removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, [], "Cart cleared successfully"));
});

// Admin: Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users list retrieved successfully"));
});

export {
    registerUser,
    loginUser,
    ownerLogin,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    changeCurrentPassword,
    getUserCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getAllUsers
};