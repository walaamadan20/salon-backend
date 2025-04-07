const router = require('express').Router()
const Product = require("../models/Products")
const verifyToken = require("../middleware/verify-token")
// Get all products (public access)
router.get("/", async (req, res) => {
    try {
        const allProducts = await Product.find()
        res.json(allProducts)
    }
    catch(err) {
        res.status(500).json({err: err.message})
    }
})
// Get single product (public access)
router.get("/:productId", async (req, res) => {
    try {
        const foundProduct = await Product.findById(req.params.productId)
        res.json(foundProduct)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})
// Create product (admin only)
router.post("/new", verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({err: "Only admins can create products"})
        }
        const newProduct = await Product.create(req.body)
        res.status(201).json(newProduct)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})
// Update product (admin only)
router.put("/:productId", verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({err: "Only admins can update products"})
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            {new: true}
        )
        res.json(updatedProduct)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})
// Delete product (admin only)
router.delete("/:productId", verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({err: "Only admins can delete products"})
        }
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId)
        res.json(deletedProduct)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})
module.exports = router