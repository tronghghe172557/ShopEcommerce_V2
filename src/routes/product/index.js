const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
// authentication //
router.use(authenticationV2);
////////////////
router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));

// QUERY //
router.get("/drafts/all", asyncHandler(productController.getAllDraftProduct));
router.get("/published/all", asyncHandler(productController.getAllPublishProduct));

module.exports = router;
