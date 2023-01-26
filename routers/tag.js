const { Router } = require("express");

const { index, create } = require("../controllers/tag");

const tagRouter = Router();

tagRouter.get("/", index);
tagRouter.post("/", create);

module.exports = tagRouter;