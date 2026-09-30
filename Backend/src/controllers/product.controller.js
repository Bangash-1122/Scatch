import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Get all products with filtering, search, sorting, and pagination
const getAllProducts = asyncHandler(async (req, res) => {
    const {
        category,
        minPrice,
        maxPrice,
        discountOnly,
        inStockOnly,
        search,
        sortBy = "newest",
        page = 1,
        limit = 50
    } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== "all" && category !== "All Products") {
        query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Discount
    if (discountOnly === "true" || discountOnly === true) {
        query.discountPercent = { $gt: 0 };
    }

    // Filter by Stock
    if (inStockOnly === "true" || inStockOnly === true) {
        query.stock = { $gt: 0 };
    }

    // Search keyword
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === "price-low") {
        sortOptions = { price: 1 };
    } else if (sortBy === "price-high") {
        sortOptions = { price: -1 };
    } else if (sortBy === "name") {
        sortOptions = { name: 1 };
    } else if (sortBy === "newest") {
        sortOptions = { createdAt: -1 };
    } else if (sortBy === "popular") {
        sortOptions = { stock: -1, createdAt: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                products,
                total: totalProducts,
                page: pageNumber,
                totalPages: Math.ceil(totalProducts / pageSize)
            },
            "Products retrieved successfully"
        )
    );
});

// Get single product by ID
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id);
    }

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

// Create new product
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        category,
        price,
        stock,
        description,
        discription,
        image,
        bgColor,
        panelColor,
        textColor,
        discountPercent
    } = req.body;

    const actualName = name?.trim();
    const actualCategory = category?.trim();
    const actualDescription = (description || discription || "").trim();

    if (!actualName || !actualCategory || price === undefined || stock === undefined) {
        throw new ApiError(400, "Name, category, price, and stock are required");
    }

    let finalImageUrl = (image || "").trim();

    // Check if an image was uploaded via Multer
    if (req.file) {
        const localPath = req.file.path;
        const uploadResult = await uploadOnCloudinary(localPath);
        if (uploadResult?.secure_url) {
            finalImageUrl = uploadResult.secure_url;
        }
    }

    // Default placeholder image if none provided
    if (!finalImageUrl) {
        finalImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80";
    }

    // Auto-create category in Category collection if it doesn't exist
    let categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${actualCategory}$`, "i") }
    });

    if (!categoryDoc) {
        try {
            categoryDoc = await Category.create({ name: actualCategory });
        } catch {
            // Category may have been created concurrently
            categoryDoc = await Category.findOne({
                name: { $regex: new RegExp(`^${actualCategory}$`, "i") }
            });
        }
    }

    const product = await Product.create({
        name: actualName,
        category: actualCategory,
        categoryRef: categoryDoc?._id,
        price: Number(price),
        stock: Number(stock),
        description: actualDescription || "No description provided",
        image: finalImageUrl,
        productImage: finalImageUrl,
        bgColor: bgColor || "#E9D3CB",
        panelColor: panelColor || "#D1B1A3",
        textColor: textColor || "#5E4032",
        discountPercent: Number(discountPercent || 0),
        owner: req.user?._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
        throw new ApiError(404, "Product not found");
    }

    const updates = { ...req.body };

    // Handle image upload if provided
    if (req.file) {
        const localPath = req.file.path;
        const uploadResult = await uploadOnCloudinary(localPath);
        if (uploadResult?.secure_url) {
            updates.image = uploadResult.secure_url;
            updates.productImage = uploadResult.secure_url;
        }
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.discountPercent !== undefined) updates.discountPercent = Number(updates.discountPercent);

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product deleted successfully"));
});

// Clear all products (Admin Panel "Delete All")
const clearAllProducts = asyncHandler(async (req, res) => {
    await Product.deleteMany({});
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All products deleted successfully"));
});

// Seed Initial Products
const seedProducts = asyncHandler(async (req, res) => {
    const initialBags = [
        {
            name: "Clinge Bag",
            price: 1200,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1bag-FBQno98AXtDnWi56egdllGVc7VzuKu.png",
            category: "Duffel",
            description: "Classic leather duffel for daily travel",
            stock: 15,
            bgColor: "#E9D3CB",
            panelColor: "#D1B1A3",
            textColor: "#5E4032"
        },
        {
            name: "Backpack",
            price: 1100,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2bag-4sM5bW2NZaQV9kZRIDbmY6i1nuDivM.png",
            category: "Backpack",
            description: "Navy city backpack",
            stock: 12,
            bgColor: "#E4E8EC",
            panelColor: "#BFD3E1",
            textColor: "#2F4E62"
        },
        {
            name: "Multipurpose",
            price: 100,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3bag%201-KmZR532uMH3mKNoSf9iidz8vYwrCUn.png",
            category: "Tote",
            description: "Everyday lightweight tote",
            stock: 20,
            bgColor: "#D0C4B0",
            panelColor: "#B9A88C",
            textColor: "#4A3F2C"
        },
        {
            name: "Pink Attack",
            price: 1400,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4bag-yIrF5Nuv08gDwAP1NFlkYLFFBvWeSs.png",
            category: "Backpack",
            description: "Bold pink fashion backpack",
            stock: 8,
            bgColor: "#EACFD5",
            panelColor: "#D2B3BD",
            textColor: "#68424C",
            discountPercent: 25
        },
        {
            name: "The Stud",
            price: 1100,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5bag-C1s34qoIKwrXx6Y8VM0PX5qx2vNnqf.png",
            category: "Backpack",
            description: "Matte black backpack",
            stock: 10,
            bgColor: "#CFCFD1",
            panelColor: "#B5B5B7",
            textColor: "#343436"
        },
        {
            name: "Surprise",
            price: 1100,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6bag-At2ZbbWvmYMvsg2HtjUzNmv9Jj6mBD.png",
            category: "Pouch",
            description: "Soft fabric pouch bag",
            stock: 18,
            bgColor: "#E7DECD",
            panelColor: "#D3C4A8",
            textColor: "#5A4C36"
        },
        {
            name: "Supreme",
            price: 1800,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7bag-clXxb35jz7zrf27hE4KEEIkLyLzc1x.png",
            category: "Backpack",
            description: "Sharp edge premium backpack",
            stock: 25,
            bgColor: "#CACBCC",
            panelColor: "#A9ABAE",
            textColor: "#353A40"
        }
    ];

    const count = await Product.countDocuments();
    if (count > 0 && req.query.force !== "true") {
        return res
            .status(200)
            .json(new ApiResponse(200, { count }, "Products already seeded. Pass ?force=true to re-seed."));
    }

    if (req.query.force === "true") {
        await Product.deleteMany({});
    }

    const created = await Product.insertMany(initialBags);

    // Also seed categories
    const categories = ["Backpack", "Duffel", "Tote", "Pouch"];
    for (const catName of categories) {
        await Category.findOneAndUpdate(
            { name: catName },
            { name: catName },
            { upsert: true, new: true }
        );
    }

    return res
        .status(201)
        .json(new ApiResponse(201, created, `${created.length} products seeded successfully`));
});

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    seedProducts
};
