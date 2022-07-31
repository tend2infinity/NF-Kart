import express from "express"
const router = express.Router()
import {
  addOrderItems,
  getEmail,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.mjs"
import { protect, admin } from "../middleware/authMiddleware.mjs"
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders)
router.route("/myorders").get(protect, getMyOrders)
router.route("/myorders/getemail").post(protect,getEmail)
router.route("/:id").get(protect, getOrderById)
router.route("/:id/pay").put(protect, updateOrderToPaid)
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered)
export default router
