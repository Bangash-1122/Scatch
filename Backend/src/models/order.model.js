import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    image: {
        type: String,
        default: ""
    }
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        orderItems: {
            type: [orderItemSchema],
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.length > 0;
                },
                message: "Order must contain at least one item"
            }
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        // Legacy alias for totalAmount
        orderPrice: {
            type: Number,
            min: 0
        },
        discountAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        platformFee: {
            type: Number,
            default: 20,
            min: 0
        },
        shippingFee: {
            type: Number,
            default: 0,
            min: 0
        },
        address: {
            type: String,
            required: [true, "Shipping address is required"],
            trim: true
        },
        contactPhone: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PENDING",
            index: true
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING"
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE", "CARD"],
            default: "COD"
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

orderSchema.pre("save", function (next) {
    if (!this.orderPrice && this.totalAmount) {
        this.orderPrice = this.totalAmount;
    } else if (!this.totalAmount && this.orderPrice) {
        this.totalAmount = this.orderPrice;
    }
    next();
});

export const Order = mongoose.model("Order", orderSchema);