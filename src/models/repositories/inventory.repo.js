const { convertToObjectId } = require("../../utils");
const { inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "Unknown",
}) => {
  return inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

// reserve inventory
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: convertToObjectId(productId),
    inven_stock: { $gte: quantity }, // stock >= quantity
  }, updateSet = {
    $inc: { inven_stock: -quantity },
    $push: { 
      inven_reservations: {
        cartId, 
        quantity,
        createOn: new Date(),
      }
     },
  }, options = {
    new: true,
    upsert: true, // nếu không có thì insert
  };

  return await inventory.updateOne(query, updateSet, options);
}

module.exports = {
  insertInventory,
  reservationInventory,
};
