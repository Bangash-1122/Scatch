import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

// Get all categories with product count
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });

    // Aggregate product count for each category
    const categoryCounts = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        }
    ]);

    const countMap = {};
    categoryCounts.forEach((c) => {
        if (c._id) {
            countMap[c._id.toLowerCase()] = c.count;
        }
    });

    const enrichedCategories = categories.map((cat) => {
        const catObj = cat.toObject();
        catObj.productCount = countMap[cat.name.toLowerCase()] || 0;
        return catObj;
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                enrichedCategories,
                "Categories retrieved successfully"
            )
        );
});

// Get category by ID or slug
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let category = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        category = await Category.findById(id);
    }

    if (!category) {
        category = await Category.findOne({
            $or: [{ slug: id.toLowerCase() }, { name: new RegExp(`^${id}$`, "i") }]
        });
    }

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const products = await Product.find({
        category: { $regex: new RegExp(`^${category.name}$`, "i") }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            { category, products, productCount: products.length },
            "Category details retrieved successfully"
        )
    );
});

// Create new category
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const cleanName = name.trim();
    const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${cleanName}$`, "i") }
    });

    if (existingCategory) {
        throw new ApiError(409, "Category with this name already exists");
    }

    const category = await Category.create({
        name: cleanName,
        description: description?.trim() || "",
        image: image || ""
    });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (name && name.trim()) {
        const cleanName = name.trim();
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${cleanName}$`, "i") },
            _id: { $ne: id }
        });

        if (existingCategory) {
            throw new ApiError(409, "Category with this name already exists");
        }

        category.name = cleanName;
        category.slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;

    await category.save();

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category deleted successfully"));
});

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
