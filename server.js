const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const testJwtRouter = require("./controllers/test-jwt")
const authRoutes = require("./controllers/auth.routes")
const verifyToken = require("./middleware/verify-token")
const productsRoutes = require("./controllers/product.routes")
const orderRoutes = require("./routes/orderRoutes");


mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use("/auth",authRoutes)
app.use("/product",productsRoutes)
app.use("/api/orders", orderRoutes);

app.use("/test-jwt",verifyToken,testJwtRouter)



app.listen(3000, () => {
  console.log('The express app is ready!');
});
