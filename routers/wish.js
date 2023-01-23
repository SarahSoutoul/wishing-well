const { Router } = require("express");

const { index, create, show } = require("../controllers/wish");

const wishRouter = Router();

wishRouter.get("/", index);
wishRouter.post("/", create);
wishRouter.get("/:id", show);

module.exports = wishRouter;