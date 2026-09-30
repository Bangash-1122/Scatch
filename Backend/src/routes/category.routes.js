import { Router } from "express";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);
router.route("/create").post(optionalAuth, createCategory);
router.route("/:id").patch(optionalAuth, updateCategory);
router.route("/:id").put(optionalAuth, updateCategory);
router.route("/:id").delete(optionalAuth, deleteCategory);

export default router;
