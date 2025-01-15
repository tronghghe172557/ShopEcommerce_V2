const { SuccessResponse } = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
    addCommentService = async (req, res, next) => {
        new SuccessResponse({
            message: "Add comment success in addComment",
            metadata: await CommentService.addComment(req.body),
        }).send(res);
    }
}

module.exports = new CommentController(); // trả về các method của obj đó