import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Create / Place New Order
const createOrder = asyncHandler(async (req, res) => {
    const { items, address, contactPhone, paymentMethod = "COD" } = req.body;

    if (!address || !address.trim()) {
        throw new ApiError(400, "Shipping address is required");
    }

    let orderItemsData = items;

    // If items not directly supplied, attempt to fetch from user's saved cart
    if (!orderItemsData || !orderItemsData.length) {
        const user = await User.findById(req.user._id).populate("cart.product");
        if (!user.cart || !user.cart.length) {
            throw new ApiError(400, "Your cart is empty. Please add items to order.");
        }
        orderItemsData = user.cart.map((c) => ({
            productId: c.product._id,
            quantity: c.quantity
        }));
    }

    if (!orderItemsData || !orderItemsData.length) {
        throw new ApiError(400, "Order must have at least one product item");
    }

    let calculatedMrp = 0;
    let calculatedDiscount = 0;
    const finalOrderItems = [];

    // Verify each product and check stock
    for (const item of orderItemsData) {
        const prodId = item.productId || item.id || item._id;
        const requestedQty = Number(item.quantity || 1);

        if (!mongoose.Types.ObjectId.isValid(prodId)) {
            throw new ApiError(400, `Invalid product ID: ${prodId}`);
        }

        const product = await Product.findById(prodId);
        if (!product) {
            throw new ApiError(404, `Product not found with ID ${prodId}`);
        }

        if (product.stock < requestedQty) {
            throw new ApiError(
                400,
                `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${requestedQty}`
            );
        }

        const itemPrice = product.price;
        const itemDiscount = product.discountPercent
            ? Math.round((itemPrice * product.discountPercent) / 100)
            : 0;

        calculatedMrp += itemPrice * requestedQty;
        calculatedDiscount += itemDiscount * requestedQty;

        finalOrderItems.push({
            productId: product._id,
            name: product.name,
            price: itemPrice,
            quantity: requestedQty,
            image: product.image || product.productImage || ""
        });
    }

    const platformFee = 20;
    const shippingFee = 0;
    const totalAmount = calculatedMrp - calculatedDiscount + platformFee + shippingFee;

    // Create the order
    const order = await Order.create({
        customer: req.user._id,
        orderItems: finalOrderItems,
        totalAmount,
        orderPrice: totalAmount,
        discountAmount: calculatedDiscount,
        platformFee,
        shippingFee,
        address: address.trim(),
        contactPhone: contactPhone?.trim() || req.user.contact || "",
        paymentMethod,
        paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
        status: "PENDING"
    });

    // Deduct stock for ordered products
    for (const item of finalOrderItems) {
        await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
        });
    }

    // Clear user cart after successful order placement
    await User.findByIdAndUpdate(req.user._id, {
        $set: { cart: [] }
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order placed successfully"
        )
    );
});

// Get My Orders (Logged in User)
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ customer: req.user._id })
        .populate("orderItems.productId", "name image price category")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

// Get Order Details by ID
const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order ID");
    }

    const order = await Order.findById(id)
        .populate("customer", "fullName email contact")
        .populate("orderItems.productId", "name image price category");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Check ownership or admin status
    const isOwner = order.customer?._id?.toString() === req.user._id?.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "owner";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Unauthorized to view this order");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order details retrieved successfully"));
});

// Get All Orders (Admin / Owner Panel)
const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) {
        query.status = status.toUpperCase();
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate("customer", "fullName email contact")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orders,
                total: totalOrders,
                page: pageNumber,
                totalPages: Math.ceil(totalOrders / pageSize)
            },
            "All orders retrieved successfully"
        )
    );
});

// Update Order Status (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order ID");
    }

    const allowedStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (status && !allowedStatuses.includes(status.toUpperCase())) {
        throw new ApiError(400, `Status must be one of: ${allowedStatuses.join(", ")}`);
    }

    const updates = {};
    if (status) updates.status = status.toUpperCase();
    if (paymentStatus) updates.paymentStatus = paymentStatus.toUpperCase();

    const order = await Order.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// Cancel Order
const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order ID");
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const isOwner = order.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "owner";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Unauthorized to cancel this order");
    }

    if (order.status === "DELIVERED") {
        throw new ApiError(400, "Delivered orders cannot be cancelled");
    }

    if (order.status === "CANCELLED") {
        throw new ApiError(400, "Order is already cancelled");
    }

    order.status = "CANCELLED";
    await order.save();

    // Restore product stock
    for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity }
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order cancelled successfully and stock restored"));
});

export {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};
