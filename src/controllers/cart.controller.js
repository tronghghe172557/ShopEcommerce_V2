const cartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {

  addToCart = async (req, res) => {
    new SuccessResponse({
        message: "Product added to cart successfully",
        metadata: await cartService.addToCart( req.body )
    }).send(res)
  }

  update = async (req, res) => {
    new SuccessResponse({
        message: "Update product to cart successfully",
        metadata: await cartService.addToCartV2( req.body )
    }).send(res)
  }

  delete = async (req, res) => {
    new SuccessResponse({
        message: "Delete product to cart successfully",
        metadata: await cartService.deleteUserCart( req.body )
    }).send(res)
  }

  listToCart = async (req, res) => {
    new SuccessResponse({
        message: "listToCart cart to cart successfully",
        metadata: await cartService.getListUserCart( req.body )
    }).send(res)
  }
}

module.exports = new CartController();
