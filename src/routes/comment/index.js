const express = require("express");
const router = express.Router();
const CommentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helpers/asyncHandle");

//
router.post("/", asyncHandler(CommentController.addCommentService));

module.exports = router;
