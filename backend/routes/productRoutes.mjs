import express from "express"
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  updateProductTokenId
} from "../controllers/productController.mjs"
import { protect, admin } from "../middleware/authMiddleware.mjs"

router.route("/").get(getProducts).post(protect, admin, createProduct)
router.route("/:id/reviews").post(protect, createProductReview)
router.get("/top", getTopProducts)
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

router.route("/updatetokenId/:id").post(protect,admin,updateProductTokenId)

export default router
