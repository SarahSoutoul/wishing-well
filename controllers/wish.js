const e = require("cors");
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
    const withComments = req.query.comments === 'true';
    try {
        const data = await Wish.getOneById(id, withComments);
        res.json(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            "error": true,
            "message": `Unable to locate wish with id ${id}.`
        });
    }
}

async function edit (req, res) {
    const id = req.params.id;
    let { type, value } = req.body;
    console.log(type, value)
    try {
        if (!(["status", "report", "grant", "deny"].includes(type))) {
            throw new Error(`Invalid property ${type}`);
        } else {
            type = ["grant", "deny"].includes(type) ? `votes_${type}` : type;
            type = "report" ? "reported" : type;
        }
        const wish = await Wish.getOneById(id);

        if (["reported", "votes_grant", "votes_deny"].includes(type)) {
            value = parseInt(value);
            if (!value || (value != 1 && value != -1)) {
                throw new Error(`Invalid update value.`);
            }
            value = wish[type] + value;
        } else {
            type = "wish_status";
            if (!['asked', 'granted', 'denied'].includes(value)) {
                throw new Error(`Invalid update value.`);
            }
        }

        const updatedWish = await wish.update(type, value);
        res.status(200).json(updatedWish);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            "error": true,
            "message": "Unable to update wish."
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
    edit,
    create
}