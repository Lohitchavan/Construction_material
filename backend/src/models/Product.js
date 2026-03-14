const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Cement", "Bricks", "Sand", "Steel", "Tiles", "Paint"],
      index: true,
    },
    image: { type: String, required: true },
    supplier: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);

