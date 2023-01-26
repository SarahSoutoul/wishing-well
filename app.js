const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const wishRouter = require("./routers/wish");
const tagRouter = require("./routers/tag");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/wishes", wishRouter);
app.use("/tags", tagRouter);

app.get("/", (req, res) => {
    res.json({
        "message": "Welcome to the Wishing Well API."
    })
})

module.exports = app;