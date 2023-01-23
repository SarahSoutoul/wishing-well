const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const wishRouter = require("./routers/wish");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/wishes", wishRouter);

app.get("/", (req, res) => {
    res.json({
        "message": "Welcome to the Wishing Well API."
    })
})

module.exports = app;