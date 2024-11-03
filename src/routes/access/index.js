const express = require("express");
const accessController = require("../../controllers/access/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// sign up
router.post("/shop/signUp", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authenticationV2)
//
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/handleRefreshToken", asyncHandler(accessController.handleRefreshToken));


module.exports = router;
