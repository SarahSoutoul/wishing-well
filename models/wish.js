const format = require("pg-format");

const db = require("../database/connect");

class Wish {

    constructor({ wish_id, wish_text, created_at, wish_status, votes_grant, votes_deny, reported }) {
        this.id = wish_id;
        this.text = wish_text;
        this.createdAt = created_at;
        this.status = wish_status;
        this.votes_grant = votes_grant;
        this.votes_deny = votes_deny;
        this.reported = reported;
    };

    static async getAll(limit, offset) {
        if (!limit || !parseInt(limit) || limit < 1 || limit > 50) {
            limit = 20;
        }
        if (!offset || !parseInt(offset) || offset < 1) {
            offset = 0;
        }
        const res = await db.query("SELECT * FROM wish LIMIT $1 OFFSET $2;", [limit, offset]);
        return res.rows.map(r => new Wish(r));
    };

    static async getOneById(id, withComments) {
        const res = await db.query("SELECT * FROM wish WHERE wish_id = $1;", [id]);
        if (res.rows.length != 1) {
            throw new Error("Unable to locate wish.")
        } else {
            const wish = new Wish(res.rows[0]);
            return wish;
        };
    };

    static async create(text) {
        const res = await db.query("INSERT INTO wish (wish_text) VALUES ($1) RETURNING *;", [text]);
        if (res.rows.length != 1) {
            throw new Error("Unable to locate wish.")
        }
        return new Wish(res.rows[0]);
    }

    async update(type, value) {
        const formattedQuery = format("UPDATE wish SET %I = $1 WHERE wish_id = $2 RETURNING *;", type);
        const res = await db.query(formattedQuery, [value, this.id]);
        if (res.rows.length != 1) {
            throw new Error("Unable to update wish.")
        }
        return new Wish(res.rows[0]);
    }
};

module.exports = Wish;