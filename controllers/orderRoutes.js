const router = require("express").Router();
const Order = require("../models/order");
const Product = require("../models/Products");
const verifyToken = require("../middleware/verify-token");

// ✅ Get all orders for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("Products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// ✅ Get one specific order by ID
router.get("/:orderId", verifyToken, async (req, res) => {
  try {
    const foundOrder = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    }).populate("Products.product");

    if (!foundOrder) {
      return res.status(404).json({ err: "Order not found or not yours" });
    }

    res.json(foundOrder);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { products } = req.body;
    let totalPrice = 0;

    for (const item of products) {
      const productData = await Product.findById(item.product);
      if (!productData) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (productData.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${productData.name}` });
      }

      productData.stock -= item.quantity;
      await productData.save();

      totalPrice += productData.price * item.quantity;
    }

    const newOrder = await Order.create({
      user: req.user._id,
      products,
      totalPrice
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// ✅ Delete an order (only by the owner)
router.delete("/:orderId", verifyToken, async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.orderId);

    if (!foundOrder) {
      return res.status(404).json({ err: "Order not found" });
    }

    if (!foundOrder.user.equals(req.user._id)) {
      return res.status(403).json({ err: "Cannot delete an order that isn't yours" });
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    res.json(deletedOrder);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
