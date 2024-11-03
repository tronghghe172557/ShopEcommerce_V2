const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: String,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Clothing", "Electronics", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define the product type
const clothingSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  material: {
    type: String,
  },
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
}, {
    collection: "Clothings",
    timestamps: true,
});

const electronicSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  color: {
    type: String,
  },
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
}, {
    collection: "Electronics",
    timestamps: true,
});

const furnitureSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  material: {
    type: String,
  },
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
}, {
    collection: "Furnitures",
    timestamps: true,
});

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model("Clothing", clothingSchema),
    electronic: mongoose.model("Electronic", electronicSchema),
    furniture: mongoose.model("Furniture", furnitureSchema),
}
