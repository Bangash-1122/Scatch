import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from "../controllers/order.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Customer Order Routes
router.route("/create").post(verifyJWT, createOrder);
router.route("/my-orders").get(verifyJWT, getMyOrders);
router.route("/:id/cancel").patch(verifyJWT, cancelOrder);
router.route("/:id").get(verifyJWT, getOrderById);

// Admin Order Management
router.route("/all").get(verifyJWT, verifyAdmin, getAllOrders);
router.route("/:id/status").patch(verifyJWT, verifyAdmin, updateOrderStatus);

export default router;
