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

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectId } = require("../utils");
const {
  foundDiscountByShopIdAndCode,
} = require("../models/repositories/discount.repo");
const {
  findAllDocumentUnSelect,
} = require("../models/repositories/common.repo");
const { findAllProduct } = require("./product.service.xxx");

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
    console.log("start_date::", new Date(start_date) );
    console.log("date::", new Date() );
    console.log(new Date() > new Date(start_date));
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError(
        "Time is not valid in DiscountService"
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
      discount_products_ids: applies_to == "all" ? [] : product_ids,
      discount_applies_to: applies_to, //== "all" ? [] : product_ids,
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
    limit = 50,
    page = 1,
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
      products = await findAllProduct({
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
      products = await findAllProduct({
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
      unSelect: ["__v"],
      model: Discount,
    });

    return discounts;
  }

  /*
        apply discount code
        products = [
            {
                product_id: '',
                product_price: '',
                product_quantity: '',
                product_name,
                product_price
            }
        ]
    */
  static async getDiscountAmount({ codeId, shopId, userId, products }) {
    const foundDiscount = await foundDiscountByShopIdAndCode(shopId, codeId);

    if (!foundDiscount) {
      throw new NotFoundError(
        "Discount code doesn't not exist in getDiscountAmount"
      );
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_user_per_user,
      discount_users_used,
    } = foundDiscount;

    // check discount code is active
    if (!discount_is_active) {
      throw new NotFoundError(
        "Discount code is not active in getDiscountAmount"
      );
    }

    // check discount max user per user
    if (!discount_max_uses) {
      throw new NotFoundError("Discount has out of use in getDiscountAmount");
    }

    // check date
    if (new Date() < discount_start_date || new Date() > discount_end_date) {
      throw new NotFoundError("Date is invalid in getDiscountAmount");
    }

    // check min order value
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total price of products
      totalOrder = products.reduce((acc, product) => {
        return acc + product.product_price * product.product_quantity;
      }, 0);

      // check total order
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount requires a minium order value of ${discount_min_order_value} getDiscountAmount`
        );
      }
    }

    // check max users
    if (discount_max_user_per_user > 0) {
      const userUsedDiscount = discount_users_used.filter(
        (user) => user.userId == userId
      );

      if (userUsedDiscount.length >= discount_max_user_per_user) {
        throw new NotFoundError(
          `Discount code has been used ${discount_max_user_per_user} times in getDiscountAmount`
        );
      }
    }

    // check discount is fixed amount or percentage
    const amount =
      discount_type == "fixed_amount"
        ? discount_value
        : (totalOrder * discount_value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /*
    delete discount code
  */
  static async deleteDiscountCode({ shopId, codeId }) {
    const foundDiscount = await foundDiscountByShopIdAndCode(shopId, codeId);

    if (!foundDiscount) {
      throw new NotFoundError(
        "Discount code doesn't not exist in deleteDiscountCode"
      );
    }

    const discountUpdated = await Discount.findByIdAndUpdate(
      foundDiscount._id,
      {
        discount_is_deleted: true,
      },
      {
        new: true,
      }
    );

    if (!discountUpdated) {
      throw new NotFoundError("Deleted false in deleteDiscountCode");
    }

    return discountUpdated;
  }

  /*
    user cancel discount code
  */
 static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await foundDiscountByShopIdAndCode(shopId, codeId);

    if (!foundDiscount) {
      throw new NotFoundError(
        "Discount code doesn't not exist in cancelDiscountCode"
      );
    }

    const discountUpdated = await Discount.findByIdAndUpdate(
      foundDiscount._id,
      {
        $pull: {
          discount_users_used: {
            userId: userId,
          },
        }, 
        $inc: {
          discount_max_uses: 1, // increase 1
          discount_uses_count: -1, // decrease 1
        },
      },
      {
        new: true,
      }
    );

    if (!discountUpdated) {
      throw new NotFoundError("Updated false in cancelDiscountCode");
    }

    return discountUpdated;
 }
}

module.exports = DiscountService;
