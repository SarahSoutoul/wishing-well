const Tag = require("../models/tag");

async function index (req, res) {
    try {
        const data = await Tag.getAll();
        res.json(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            "error": true,
            "message": "Unable to retrieve tags from database."
        });
    }
}

async function create (req, res) {
    const { text } = req.body;
    try {
        if (typeof text != "string" || text.length < 1) {
            throw new Error("Cannot create an empty tag.");
        }
        const data = await Tag.create(text);
        res.status(201).json(data);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            "error": true,
            "message": `Unable to create tag.`
        });
    }
}

module.exports = {
    index,
    create
}