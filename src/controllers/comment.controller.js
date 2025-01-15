const { SuccessResponse } = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
    addCommentService = async (req, res, next) => {
        new SuccessResponse({
            message: "Add comment success in addComment",
            metadata: await CommentService.addComment(req.body),
        }).send(res);
    }

    getCommentByProductIdService = async (req, res, next) => {
        new SuccessResponse({
            message: "Get comment success in getCommentByParentId",
            metadata: await CommentService.getCommentByParentId({
                productId: req.query.productId,
                parentCommentId: req.query.parentCommentId,
            }),
        }).send(res);
    }

    deleteCommentService = async (req, res, next) => {
        new SuccessResponse({
            message: "Get comment success in deleteComment",
            metadata: await CommentService.deleteComment({
                productId: req.query.productId,
                commentId: req.query.commentId,
            }),
        }).send(res);
    }
}

module.exports = new CommentController(); // trả về các method của obj đó