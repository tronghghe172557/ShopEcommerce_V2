const express = require("express");
const accessController = require("../../controllers/access/access.controller");
const router = express.Router();

// sign up
router.post("/shop/signUP", accessController.signUp);

module.exports = router;
