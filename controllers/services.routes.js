const router = require('express').Router()
const Services = require('../models/Services')
const verifyToken = require("../middleware/verify-token")

// Get all services (public access)
router.get("/", async (req, res) => {
    try {
        const allServices = await Services.find()
        res.json(allServices)
    }
    catch(err) {
        res.status(500).json({err: err.message})
    }
})

// Get single service (public access)
router.get("/:serviceId", async (req, res) => {
    try {
        const foundService = await Services.findById(req.params.serviceId)
        res.json(foundService)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})

// Create service (admin only)
router.post("/new", verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({err: "Only admins can create services"})
        }
        
        const newService = await Services.create(req.body)
        res.status(201).json(newService)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})

// Update service (public access)
router.put("/:serviceId", verifyToken, async (req, res) => {
    try {
        const updatedServices = await Services.findByIdAndUpdate(
            req.params.serviceId,
            req.body,
            {new: true}
        )
        res.json(updatedServices)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})

// Delete service (admin only)
router.delete("/:serviceId", verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({err: "Only admins can delete services"})
        }
        const deletedServices = await Services.findByIdAndDelete(req.params.serviceId)
        res.json(deletedServices)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
})
module.exports = router