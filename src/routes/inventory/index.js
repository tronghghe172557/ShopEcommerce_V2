const express = require("express");
const InventoryController = require("../../controllers/inventory.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.use(authenticationV2);

// get amount of discount
router.post("/review", asyncHandler(InventoryController.addStockToInventory));


module.exports = router;
