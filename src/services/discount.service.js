const Discount = require("../models/discount.model");

/*
    Discount services
    1 - Generate discount code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
*/

const { BadRequestError } = require("../core/error.response");
const { convertToObjectId } = require("../utils");
const {
  foundDiscountByShopIdAndCode,
} = require("../models/repositories/discount.repo");
const {
  findAllPublishForShop,
} = require("../models/repositories/product.repo");
const { findAllDocumentUnSelect } = require("../models/repositories/common.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // check
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError(
        "Discount code is not valid in DiscountService"
      );
    }

    // create index for discount code
    const foundDiscount = foundDiscountByShopIdAndCode(shopId, code);

    if (!foundDiscount && !foundDiscount.discount_is_active) {
      throw new BadRequestError(
        "Discount code is already exist in DiscountService"
      );
    }
    const newDiscount = await Discount.create({
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_is_active: is_active,
      discount_shopId: convertToObjectId(shopId),
      discount_min_order_value: min_order_value || 0,
      discount_products_ids: product_ids,
      discount_applies_to: applies_to == "all" ? [] : product_ids,
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_user_per_user: max_uses_per_user,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {}

  /*
        Get all discount available with product
    */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount code
    const foundDiscount = await foundDiscountByShopIdAndCode(shopId, code);

    //
    if (!foundDiscount && !foundDiscount.discount_is_active) {
      throw new BadRequestError(
        "Discount code exist in getAllDiscountCodesWithProduct"
      );
    }

    //
    const { discount_applies_to, discount_products_ids } = foundDiscount;

    let products;

    // array includes all products
    if (discount_applies_to == "all") {
      products = await findAllPublishForShop({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: limit,
        page: page,
        sort: "ctime",
        select: [
          "product_name",
          "product_thumb",
          "product_price",
          "product_quantity",
          "product_type",
          "product_shop",
        ],
      });
    }

    // array includes products which are selected by shop
    if (discount_applies_to == "specific") {
      // array includes products which are selected by shop
      products = await findAllPublishForShop({
        filter: {
          _id: { $in: discount_products_ids },
          isPublished: true,
        },
        limit: limit,
        page: page,
        sort: "ctime",
        select: [
          "product_name",
          "product_thumb",
          "product_price",
          "product_quantity",
          "product_type",
          "product_shop",
        ],
      });
    }

    return products;
  }

  /*
        Get all discount code shop
    */
  static async getAllDiscountCodesForShop({ shopId, limit, page }) {    
    const discounts = await findAllDocumentUnSelect({
        limit: +limit,
        page: +page,
        filter: {
            discount_shopId: shopId,
            discount_is_active: true,
        }, 
        unSelect: ['__v'],
        model: Discount
    })

    return discounts;
  }
}
