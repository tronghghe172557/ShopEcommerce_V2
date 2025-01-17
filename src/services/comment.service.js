const { NotFoundError, BadRequestError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { product } = require("../models/product.model");
const { convertToObjectId } = require("../utils/index");
/*
    1. add comment
    2. get list comment
    3. delete comment
*/

// Comment 1
//   ├── Comment 2
//   └── Comment 3
//       ├── Comment 4
//       └── Comment 5

// Comment 1: left = 1, right = 10
//   ├── Comment 2: left = 2, right = 3
//   └── Comment 3: left = 4, right = 9
//       ├── Comment 4: left = 5, right = 6
//       └── Comment 5: left = 7, right = 8
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
      if (!parentComment) {
        throw new NotFoundError("Not found parent comment");
      }

      rightValue = parentComment.comment_right;

      // update many
      // update all comment if comment_right >= rightValue
      await Comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
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
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {

    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) {
        throw new NotFoundError("Not found parent comment");
      }

      //
      const comments = await Comment.find({
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_content: 1,
          comment_userId: 1,
          comment_parentId: 1,
          comment_left: 1,
          comment_right: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    //
    const comments = await Comment.find({
      comment_productId: convertToObjectId(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_content: 1,
        comment_userId: 1,
        comment_parentId: 1,
        comment_left: 1,
        comment_right: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  // cong thuc: right - left + 1 => số lượng comment
  static async deleteComment({ commentId, productId }) {
    const findProduct = await product.findById(convertToObjectId(productId));
    if (!findProduct) {
      throw new NotFoundError("Not found product in deleteComment");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError("Not found comment in deleteComment");
    }

    // 1. define left, right
    const left = comment.comment_left;
    const right = comment.comment_right;

    // 2. count width
    const width = right - left + 1;

    // 3. delete comment in range width
    await Comment.deleteMany({
      comment_productId: convertToObjectId(productId),
      comment_left: { $gte: left, $lte: right }, // delete comment in range left, right
    });

    // 4. update left, right
    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_right: { $gt: right }, // gt is greater than, count comment_right > right
      },
      {
        $inc: { comment_right: -width }, // decrease comment_right by width
      }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: right }, // gt is greater than, count comment_left > right
      },
      {
        $inc: { comment_left: -width },
      }
    );
  }
}

module.exports = CommentService;
