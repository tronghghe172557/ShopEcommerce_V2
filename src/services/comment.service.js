const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils/index");
/*
    1. add comment
    2. get list comment
    3. delete comment
*/
class CommentService {
  static async addComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    //
    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if(!parentComment) {
        throw new NotFoundError("Not found parent comment");
      }

      rightValue = parentComment.comment_right;
      
      // update many
      // update all comment if comment_right >= rightValue
      await Comment.updateMany({
        comment_productId: convertToObjectId(productId),
        comment_right: { $gte: rightValue },
      }, {
        $inc: { comment_right: 2 },
      })

      await Comment.updateMany({
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: rightValue },
      }, {
        $inc: { comment_left: 2 },
      })
    } else {
      // comment is root
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectId(productId),
        },
        "comment_right"
      ).sort({ comment_right: -1 });

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      } 
    }

    // insert 
    comment.comment_left = rightValue; 
    comment.comment_right = rightValue + 1 ;


    await comment.save();
    return comment;
  }
}

module.exports = CommentService;