const { max } = require("lodash");
const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify")
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
      type: Number,
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
    // more
    product_ratingAverage: {
      type: Number,
      default: 4,
      min: [1, "Rating must be above 1.0"],
      max : [5, "Rating must be below 5.0"],
      // 4.333334 => 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    product_slug: {
      type: String,
    },
    product_variants: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false, // hide this field from the query result
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false, // hide this field from the query result
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create index for searching
productSchema.index({
  product_name: "text",
  product_description: "text",
});

// Document middleware for slugify 
// the second argument is a function - not an arrow function
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next(); 
})

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
