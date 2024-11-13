const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// get amount of discount
router.post("/review", asyncHandler(checkoutController.checkoutReview));

// authentication
router.use(authenticationV2);


module.exports = router;
