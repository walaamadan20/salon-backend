const { Schema, model, Types } = require("mongoose");

const orderSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      product: { type: Types.ObjectId, ref: "Products" },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = model("Order", orderSchema);

module.exports = Order;