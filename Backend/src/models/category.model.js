import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            index: true
        },
        slug: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        image: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

categorySchema.pre("save", function (next) {
    if (this.isModified("name") && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    next();
});

export const Category = mongoose.model("Category", categorySchema);