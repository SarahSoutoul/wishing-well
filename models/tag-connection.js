const db = require("../database/connect");

class TagConnection {

    constructor({ tag_connection_id, wish_id, tag_id}) {
        this.id = tag_connection_id;
        this.wish_id = wish_id;
        this.tag_id = tag_id;
    }

    static async create(wish_id, tag_id) {
        const res = await db.query("INSERT INTO tag_connection (wish_id, tag_id) VALUES ($1, $2) RETURNING *;", [wish_id, tag_id]);
        if (res.rows.length != 1) {
            throw new Error("Unable to create tag connection.")
        }
        return new TagConnection(res.rows[0]);
    }
}

module.exports = TagConnection;