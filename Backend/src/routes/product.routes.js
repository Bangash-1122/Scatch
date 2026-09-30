import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    seedProducts
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { optionalAuth, verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Product Routes
router.route("/").get(getAllProducts);
router.route("/seed").post(seedProducts);
router.route("/clear-all").delete(clearAllProducts);
router.route("/:id").get(getProductById);

// Product Management (Supports image upload via multipart form-data or JSON with image URL)
router.route("/create").post(
    upload.single("image"),
    optionalAuth,
    createProduct
);

router.route("/:id").patch(
    upload.single("image"),
    optionalAuth,
    updateProduct
);

router.route("/:id").put(
    upload.single("image"),
    optionalAuth,
    updateProduct
);

router.route("/:id").delete(deleteProduct);

export default router;
