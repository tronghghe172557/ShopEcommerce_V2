const checkoutService = require("../services/checkout.service");
const { SuccessResponse } = require("../core/success.response");

class checkoutController {

  checkoutReview = async (req, res) => {
    new SuccessResponse({
        message: "checkoutReview successfully",
        metadata: await checkoutService.checkOutReview( req.body )
    }).send(res)
  }
}

module.exports = new checkoutController();
