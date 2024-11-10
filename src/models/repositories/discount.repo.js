const { convertToObjectId } = require("../../utils");
const discountModel = require("../discount.model");

const foundDiscountByShopIdAndCode = async (shopId, code) => {
  // create index for discount code
  const foundDiscount = await discountModel
    .findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId),
    })
    .lean()
    .exec();

  return foundDiscount;
};

module.exports = {
  foundDiscountByShopIdAndCode,
};
