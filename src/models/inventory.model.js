// !dmbg => tạo models nhanh cho mongodb
const mongoose = require("mongoose"); // Erase if already required
const { model, Schema, Types } = require("mongoose");
const { DefaultDeserializer } = require("v8");
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Hàng tồn kho
var inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    inven_location: {
      type: String,
      default: 'Unknown',
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    inven_reservations: { // đặt hàng trước // add vào giỏ hàng
      type: Array,
      default: []  
    },
    
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = {
    inventory: mongoose.model(DOCUMENT_NAME, inventorySchema),
}