const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check API key
router.use(apiKey)

// check Permission
router.use(permission("0000"))

// this is special route -> first route
router.use('/v1/api/product', require('./product'));

router.use('/v1/api/discount', require('./discount'));

router.use('/v1/api', require('./access'));

module.exports = router;
