const db = require("../database/connect");

class Tag {
    
    constructor({ tag_id, tag_text }) {
        this.id = tag_id;
        this.text = tag_text;
    }

    static async getAll() {
        const res = await db.query("SELECT * FROM tag;");
        return res.rows.map(r => new Tag(r));
    };

    static async create(text) {
        const res = await db.query("INSERT INTO tag (tag_text) VALUES ($1) RETURNING *;", [text]);
        if (res.rows.length != 1) {
            throw new Error("Unable to create tag.")
        }
        return new Tag(res.rows[0]);
    }
}

module.exports = Tag;