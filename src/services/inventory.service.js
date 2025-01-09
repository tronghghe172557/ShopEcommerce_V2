const { BadRequestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { findProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "Unknown",
  }) {
    const product = await findProductById({ productId });
    if (!product) {
      throw new BadRequestError("Product does not exist in  InventoryService");
    }

    const query = {
        inven_shopId: shopId,
        inven_productId: productId,
      },
      updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      options = {
        new: true,
        upsert: true,
      };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
