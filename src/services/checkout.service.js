const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");

class checkOutService {
  /*
        {
            cartId, 
            userId,
            shop_order_ids [
                {
                    shop_id,
                    shop_discount: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_product: [
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                },
            ]
        }
    */

  static async checkOutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exist
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart does not exist");
    }

    // return data follow format
    const checkout_order = {
        totalPrice: 0, // total price of all order
        freeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // (1) + (3) + (4) is value of checkout_order

    // calculate total price for each product
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // check product available in shop
      const checkProductServer = await checkProductByServer(item_products);
      //   console.log("checkProductServer::", checkProductServer);
      if (!checkProductServer) {
        throw new BadRequestError("Product is something wrong");
      }

      // checkout price
      const checkoutPrice = checkProductServer.reduceRight((acc, cur) => {
        return acc + cur.price * cur.quantity;
      }, 0);

      // update totalPrice -> oke -> understand
      checkout_order.totalPrice += checkoutPrice; // (1)

      //
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // price before discount
        priceApplyDiscount: checkoutPrice, // price after discount
        item_products: checkProductServer, // product detail
      };

      // check discount exist -> if shopDiscount exist, calculate discount
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmountV2({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });

        console.log("totalPrice::", totalPrice);
        console.log("discount::", discount);

        if (totalPrice == 0 || discount == 0) {
          return BadRequestError("Discount is something wrong");
        }

        // total price after discount
        checkout_order.totalDiscount += discount; // (3)

        // if discount > 0, change price
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // the last calculate
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount; // (4)
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = checkOutService;
