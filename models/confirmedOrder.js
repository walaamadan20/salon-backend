const { Schema, model, Types } = require("mongoose");

const confirmedOrderSchema = new Schema({
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
  confirmedAt: {
    type: Date,
    default: Date.now
  }
});

const ConfirmedOrder = model("ConfirmedOrder", confirmedOrderSchema);

module.exports = ConfirmedOrder;
