const Wish = require("../models/wish");

async function index (req, res) {
    const { limit, offset, } = req.query;
    try {
        const data = await Wish.getAll(limit, offset);
        res.json(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            "error": true,
            "message": "Unable to retrieve wishes from database."
        });
    }
}

async function show (req, res) {
    const id = parseInt(req.params.id);
    try {
        const data = await Wish.getOneById(id);
        res.json(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            "error": true,
            "message": `Unable to locate wish with id ${id}.`
        });
    }
}

async function create (req, res) {
    const { text } = req.body;
    try {
        const data = await Wish.create(text);
        res.status(201).json(data);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            "error": true,
            "message": `Unable to create wish.`
        });
    }
}


module.exports = {
    index,
    show,
    create,
}