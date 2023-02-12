const { Router } = require("express");

const { index, create, show, edit } = require("../controllers/wish");
const commentRouter = require("./comment");

const wishRouter = Router();

wishRouter.get("/", index);
wishRouter.post("/", create);
wishRouter.get("/:id", show);
wishRouter.patch("/:id", edit);
wishRouter.use("/", commentRouter);

module.exports = wishRouter;