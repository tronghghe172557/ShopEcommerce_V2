const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// PUBLIC FOR USER //
router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication //
router.use(authenticationV2);
////////////////
router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

// PATCH //
router.patch("/:productId", asyncHandler(productController.updateProduct));


// QUERY //
router.get("/drafts/all", asyncHandler(productController.getAllDraftProduct));
router.get("/published/all", asyncHandler(productController.getAllPublishProduct));

module.exports = router;
