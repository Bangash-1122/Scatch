import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Auth Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/owner-login").post(ownerLogin);
router.route("/refresh-token").post(refreshAccessToken);

// Protected User Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// Cart Routes
router.route("/cart").get(verifyJWT, getUserCart);
router.route("/cart/add").post(verifyJWT, addToCart);
router.route("/cart/update").patch(verifyJWT, updateCartQuantity);
router.route("/cart/remove/:productId").delete(verifyJWT, removeFromCart);
router.route("/cart/clear").delete(verifyJWT, clearCart);

// Admin Routes
router.route("/all").get(verifyJWT, verifyAdmin, getAllUsers);

export default router;