// !dmbg => tạo models nhanh cho mongodb
const mongoose = require("mongoose"); // Erase if already required
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    }, 
    cart_products: {
        type: Array,
        default: [],
        required: true, 
    },
    cart_count_product: {
        type: Number,
        default: 0,
    }, 
    cart_userId: {
        type: String, // chưa làm phần user này
        required: true,
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema)
