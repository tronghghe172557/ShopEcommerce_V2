// !dmbg => tạo models nhanh cho mongodb
const mongoose = require("mongoose"); // Erase if already required
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: "fixed_amount", // percentage
    },
    discount_value: {
      type: Number, // 10.000 , 10%
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      // start_date < end_date
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // số lần sử dụng tối đa
      type: Number,
      required: true,
    },
    discount_users_used: {
      // số lần sử dụng
      type: Array,
      default: [],
    },
    discount_max_user_per_user: {
      // số lần sử dụng tối đa cho 1 user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      // giá trị đơn hàng tối thiểu
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_products_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = {
  inventory: mongoose.model(DOCUMENT_NAME, discountSchema),
};
