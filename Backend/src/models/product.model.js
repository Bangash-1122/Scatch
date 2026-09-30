import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },
        // Backward compatibility for spelling in legacy code
        discription: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            default: ""
        },
        // Backward compatibility
        productImage: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
            default: 0
        },
        discountPercent: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"]
        },
        stock: {
            type: Number,
            required: [true, "Stock count is required"],
            min: [0, "Stock cannot be negative"],
            default: 0
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            index: true
        },
        categoryRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        bgColor: {
            type: String,
            default: "#E9D3CB",
            trim: true
        },
        panelColor: {
            type: String,
            default: "#D1B1A3",
            trim: true
        },
        textColor: {
            type: String,
            default: "#5E4032",
            trim: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Sync description/discription and image/productImage
productSchema.pre("save", function (next) {
    if (this.description && !this.discription) {
        this.discription = this.description;
    } else if (this.discription && !this.description) {
        this.description = this.discription;
    }

    if (this.image && !this.productImage) {
        this.productImage = this.image;
    } else if (this.productImage && !this.image) {
        this.image = this.productImage;
    }

    next();
});

export const Product = mongoose.model("Product", productSchema);