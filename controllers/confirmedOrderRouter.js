const router = require("express").Router();
const ConfirmedOrder = require("../models/confirmedOrder");
const Order = require("../models/order");
const verifyToken = require("../middleware/verify-token");

// ✅ POST: Confirm current user's cart orders
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId }).populate("products.product");

    if (!orders.length) {
      return res.status(400).json({ error: "No orders to confirm." });
    }

    const mergedProducts = {};
    let totalPrice = 0;

    for (const order of orders) {
      for (const item of order.products) {
        const id = item.product._id.toString();
        if (!mergedProducts[id]) {
          mergedProducts[id] = {
            product: item.product._id,
            quantity: 0,
            price: item.product.price
          };
        }
        mergedProducts[id].quantity += item.quantity;
        totalPrice += item.product.price * item.quantity;
      }
    }

    const finalProducts = Object.values(mergedProducts).map(({ product, quantity }) => ({
      product,
      quantity
    }));

    const confirmed = await ConfirmedOrder.create({
      user: userId,
      products: finalProducts,
      totalPrice
    });

    await Order.deleteMany({ user: userId });

    res.status(201).json(confirmed);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// ✅ GET: All confirmed orders
router.get("/", verifyToken, async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { user: req.user._id };
    const confirmedOrders = await ConfirmedOrder.find(filter)
      .populate("products.product")
      .sort({ confirmedAt: -1 });

    res.json(confirmedOrders);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// ✅ GET: Single confirmed order
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const confirmedOrder = await ConfirmedOrder.findById(req.params.id).populate("products.product");

    if (!confirmedOrder) {
      return res.status(404).json({ err: "Confirmed order not found." });
    }

    if (!req.user.isAdmin && !confirmedOrder.user.equals(req.user._id)) {
      return res.status(403).json({ err: "Access denied." });
    }

    res.json(confirmedOrder);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
