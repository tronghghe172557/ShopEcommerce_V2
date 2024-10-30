const express = require("express");
const accessController = require("../../controllers/access/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

// sign up
router.post("/shop/signUp", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

module.exports = router;
