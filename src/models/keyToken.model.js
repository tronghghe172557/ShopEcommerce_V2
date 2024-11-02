const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
      required: true,
    },
    publicKey: {
      type: String,
    },
    privateKey: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    refreshTokensUsed: {
      type: [String], // store all refresh token used 
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
