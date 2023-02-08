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

app.get("/futureproof", (req, res) => {
    const links = ["https://www.youtube.com/watch?v=HsM_VmN6ytk",
                   "https://www.youtube.com/watch?v=XfTgCPUJwRk",
                   "https://www.youtube.com/watch?v=3V_7-7myPxM"];
    const link = links[Math.floor(Math.random()*links.length)];
    res.redirect(link);
})

module.exports = app;