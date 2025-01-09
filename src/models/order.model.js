const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip,
        }
    */
    order_checkout: {
      type: Object,
      required: true,
      default: {},
    },
    /*
        street,
        citym,
        state,
        country,
    */
    order_payment: {
      type: Object,
      default: {},
    },
    orderProducts: {
      type: Array,
      default: [],
    },
    order_trackingNumber: {
      type: String,
      default: "#000000108012025", // 08/12/2025
    },
    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "confirm", "shipped", "canceled", 'delivered'],
    },
    
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
