const {Schema, model} = require("mongoose")

const productsSchema = new Schema({
    name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  stock: { type: Number, default: 0 },
  image: {type: String}


})

const Products = model("Products",productsSchema)

module.exports = Products