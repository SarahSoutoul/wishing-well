const { Router } = require("express");

const { showComments, createComment, showComment, editComment } = require("../controllers/wish");

const commentRouter = Router();

commentRouter.get("/:id/comments", showComments);
commentRouter.post("/:id/comments", createComment);
commentRouter.get("/:wishId/comments/:commentId", showComment);
commentRouter.patch("/:wishId/comments/:commentId", editComment);

module.exports = commentRouter;