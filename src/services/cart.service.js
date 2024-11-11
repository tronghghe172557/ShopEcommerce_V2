const { BadRequestError } = require("../core/error.response");
const cartModel = require("../models/cart.model");

/*
    Cart Service
        1 Add product to Cart [User]
        2 Reduce product quantity [User]
        3 Increase product quantity [User]
        4 Get list to Cart [User]
        5 Delete cart [User]
        6 Delete cart item [User]
*/

class CartService {
  // START CART REPO //
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId, // find a specific product in array of cart_products
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          // is the operator to increment the value of the field by the specified amount
          "cart_products.$.quantity": quantity,
          // the $ positional operator to used to identify the element in the array that matches the query condition
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }
  // END START CART REPO //

  static async addToCart({ userId, product = {} }) {
    // check input parameters
    if (!userId || !product || !product.productId || !product.quantity) {
      throw new BadRequestError("Invalid input parameters in addToCart in cart.service");
    }

    // check cart exist or not
    const userCart = await cartModel.findOne({ cart_userId: userId });

    if (!userCart) {
      // create new cart
      return await CartService.createUserCart({ userId, product });
    }

    // if cart exist, but cart_products is empty
    if (!userCart.cart_products || userCart.cart_products.length === 0) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // if cart_products is not empty, then product is already in cart => update quantity
    return CartService.updateUserCart({ userId, product });
  }
}

module.exports = CartService;
