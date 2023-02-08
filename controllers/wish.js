const Wish = require("../models/wish");
const TagConnection = require("../models/tag-connection");
const Comment = require("../models/comment");

async function index (req, res) {
    const { limit, offset } = req.query;
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

async function edit (req, res) {
    const id = req.params.id;
    let { type, value } = req.body;
    try {
        if (!(["status", "report", "grant", "deny"].includes(type))) {
            throw new Error(`Invalid property ${type}`);
        } else {
            type = ["grant", "deny"].includes(type) ? `votes_${type}` : type;
            type = type == "report" ? "reported" : type;
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
    const { text, tagIds } = req.body;
    try {
        if (typeof text != "string" || text.length < 1) {
            throw new Error("Cannot create an empty wish.");
        } else if (!tagIds || !(tagIds instanceof Array) || !tagIds.every(t => typeof t == 'number')) {
            throw new Error("Cannot create a wish with invalid tags");
        }
        const data = await Wish.create(text);
        const createdTagIds = [];

        for await (const t of tagIds) {
            const conn = await TagConnection.create(data.id, t);
            createdTagIds.push(conn.tag_id);
        }

        const createdWish = Wish.getOneById(data.id);

        res.status(201).json(createdWish);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            "error": true,
            "message": `Unable to create wish.`
        });
    }
}

async function showComments (req, res) {
    const id = parseInt(req.params.id);

    try {
        const data = await Comment.getAllByWishId(id);
        res.json(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            "error": true,
            "message": `"Unable to retrieve comments from database for wish with id ${id}.`
        });
    }
}

async function createComment (req, res) {
    const id = parseInt(req.params.id);
    const { text, parentId } = req.body;

    try {

        if (typeof text != "string" || text.length < 1) {
            throw new Error("Cannot create an empty comment.");
        } else if (!(typeof parentId == 'number' || !parentId)) {
            throw new Error("Cannot create comment with an invalid parent.")
        }

        const wish = await Wish.getOneById(id);

        const possibleParents = await Comment.getAllByWishId(id, idsOnly=true);
        if (parentId && !possibleParents.includes(parentId)) {
            throw new Error("Cannot create comment with invalid parent for wish.");
        }

        const newComment = await Comment.create(text, wish.id, parentId);

        res.json(newComment);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            "error": true,
            "message": `Unable to post comment on wish with id ${id}.`
        });
    }
}

async function showComment (req, res) {
    const wishId = parseInt(req.params.wishId);
    const commentId = parseInt(req.params.commentId);
    try {
        const data = await Comment.getOneByWishIdAndId(wishId, commentId);
        res.json(data);
    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            "error": true,
            "message": `Unable to locate comment with id ${commentId} for wish with id ${wishId}.`
        });
    }
}

async function editComment (req, res) {
    const wishId = parseInt(req.params.wishId);
    const commentId = parseInt(req.params.commentId);
    let { type, value } = req.body;
    try {
        if (!(["report", "agree", "disagree"].includes(type))) {
            throw new Error(`Invalid property ${type}`);
        } else {
            type = ["agree", "disagree"].includes(type) ? `votes_${type}` : type;
            type = type == "report" ? "reported" : type;
        }
        value = parseInt(value);
        if (!value || (value != 1 && value != -1)) {
            throw new Error(`Invalid update value.`);
        }

        const comment = await Comment.getOneByWishIdAndId(wishId, commentId);
        value = comment[type] + value;
        console.log(type, value)
        const updatedComment = await comment.update(type, value);
        res.status(200).json(updatedComment);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            "error": true,
            "message": "Unable to update comment."
        });
    }
}

module.exports = {
    index,
    show,
    edit,
    create,
    showComments,
    createComment,
    showComment,
    editComment
}