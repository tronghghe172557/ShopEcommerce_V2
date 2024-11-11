const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const router = express.Router();

// sign up
router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("/", asyncHandler(cartController.listToCart));

module.exports = router;
