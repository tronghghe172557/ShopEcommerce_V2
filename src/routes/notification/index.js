const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");
const router = express.Router();

router.get("", asyncHandler(NotificationController.getNotificationByUserId));
module.exports = router;
