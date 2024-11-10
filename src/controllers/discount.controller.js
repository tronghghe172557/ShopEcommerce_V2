const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");
const {
  DISCOUNT_LIMIT,
  DISCOUNT_PAGE,
} = require("../constant/discount.constant");
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount success in createDiscountCode",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user._id,
      }),
    }).send(res);
  };

  getAllDiscountCodeForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount for shop success in getAllDiscountCodeForShop",
      metadata: await DiscountService.getAllDiscountCodesForShop({
        shopId: req.user._id,
        limit: req.query.limit
          ? Number.parseInt(req.query.limit)
          : DISCOUNT_LIMIT,
        page: req.query.page ? Number.parseInt(req.query.page) : DISCOUNT_PAGE,
      }),
    }).send(res);
  };

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    console.log("req.query::", req.query);
    new SuccessResponse({
      message:
        "Get all discount by product success in getAllDiscountCodeWithProducts",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
        limit: req.query.limit
          ? Number.parseInt(req.query.limit)
          : DISCOUNT_LIMIT,
        page: req.query.page ? Number.parseInt(req.query.page) : DISCOUNT_PAGE,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount discount amount success in getDiscountAmount",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
}
module.exports = new DiscountController(); // trả về các method của obj đó
