const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const logger = require('morgan')
const testJwtRouter = require("./controllers/test-jwt")
const authRoutes = require("./controllers/auth.routes")
const verifyToken = require("./middleware/verify-token")
const productsRoutes = require("./controllers/product.routes")
const servicesRoutes = require("./controllers/services.routes")
const orderRoutes = require("./controllers/orderRoutes");
const bookingRoutes = require("./controllers/bookings");




// Routers
const authRoutes = require("./controllers/auth.routes");
const productsRoutes = require("./controllers/product.routes");
const orderRoutes = require("./controllers/orderRoutes");
const testJwtRouter = require("./controllers/test-jwt");

// Middleware
const verifyToken = require("./middleware/verify-token");

// Models (optional, if needed later)
const User = require("./models/User");
const Product = require("./models/Products");
const Order = require("./models/order");
const Service = require("./models/Services");

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// Routes go here
app.use("/auth",authRoutes)
app.use("/product",productsRoutes)
app.use("/services",servicesRoutes)
app.use("/api/orders", orderRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/test-jwt", verifyToken, testJwtRouter);


// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 The express app is ready on http://localhost:${PORT}`);



app.use("/test-jwt",verifyToken,testJwtRouter)



});
