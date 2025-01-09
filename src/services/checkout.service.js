const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");
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

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await checkOutService.checkOutReview({
        cartId,
        userId,
        shop_order_ids: shop_order_ids,
      });

      // check product that have in stock or not
      const products = shop_order_ids_new.flatMap( order => order.item_products );
      console.log("[1]::", products);

      for(let i = 0; i < products.length; i++) {
        const { productId, quantity } = products[i];
        const keyLock = await acquireLock(productId, quantity, cartId);
        console.log("[2]::", keyLock);
        //
        acquireProduct.push(keyLock);
        if(keyLock) {
          await releaseLock(keyLock);
        }
      }

      // check 1 san pham het hang trong inventory
      if(acireProduct.includes(false)) {
        throw new BadRequestError("Product is out of stock");
      }

      const newOrder = await order.create({
        order_userId: userId,
        order_checkout: checkout_order,
        order_shipping: user_address,
        order_payment: user_payment,
        order_products: shop_order_ids_new,
      })

      // truong hop: insert thanh cong -> remove product in cart
      if(newOrder) {
        // remove product in cart
        await removeProductInCart(cartId);
        return `Order success`;
      }

      // gỉa sử tạo thành công
      return `Order success`;
  }

  /*
    Query orders by user
  */
  static async getOrdersByUser() {}

  /*
    Query one order by user
  */
  static async getOneOrderByUser() {}
  
  /*
    Cancel one order by user
  */
  static async cancelOneOrderByUser() {}

  /*
    Update one order status by [ADMIN ||  SHOP]
  */
  static async updateOrderByShop() {}
}

module.exports = checkOutService;
