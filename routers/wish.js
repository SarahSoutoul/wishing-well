const { Router } = require("express");

const { index, create, show, edit, showComments, createComment, showComment, editComment } = require("../controllers/wish");

const wishRouter = Router();

wishRouter.get("/", index);
wishRouter.post("/", create);
wishRouter.get("/:id", show);
wishRouter.patch("/:id", edit);
wishRouter.get("/:id/comments", showComments);
wishRouter.post("/:id/comments", createComment);
wishRouter.get("/:wishId/comments/:commentId", showComment);
wishRouter.patch("/:wishId/comments/:commentId", editComment);

module.exports = wishRouter;