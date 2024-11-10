const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// get amount of discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllDiscountCodeWithProducts)
);

// authentication
router.use(authenticationV2);

//create discount code
router.post("/", asyncHandler(discountController.createDiscountCode));

router.get("/", asyncHandler(discountController.getAllDiscountCodeForShop));



module.exports = router;
