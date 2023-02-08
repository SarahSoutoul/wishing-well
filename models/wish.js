const format = require("pg-format");

const db = require("../database/connect");

class Wish {

    constructor({ wish_id, wish_text, created_at, wish_status, votes_grant, votes_deny, reported, tag_ids }) {
        this.id = wish_id;
        this.text = wish_text;
        this.createdAt = created_at;
        this.status = wish_status;
        this.votes_grant = votes_grant;
        this.votes_deny = votes_deny;
        this.reported = reported;
        this.tagIds = tag_ids ? tag_ids.split(",").map(t => parseInt(t)) : [];
    };

    static async getAll(limit, offset) {
        if (!limit || !parseInt(limit) || limit < 1 || limit > 50) {
            limit = 20;
        }
        if (!offset || !parseInt(offset) || offset < 1) {
            offset = 0;
        }
        const res = await db.query(`SELECT *,
                                        (
                                            SELECT STRING_AGG(CAST (tag_id AS VARCHAR(3)), ',')
                                            FROM tag_connection AS TC
                                            WHERE TC.wish_id = W.wish_id
                                        ) AS tag_ids
                                    FROM wish AS W
                                    LIMIT $1
                                    OFFSET $2;`, [limit, offset]);
        return res.rows.map(r => new Wish(r));
    };

    static async getOneById(id) {
        const res = await db.query(`SELECT *,
                                        (
                                            SELECT STRING_AGG(CAST (tag_id AS VARCHAR(3)), ',')
                                            FROM tag_connection AS TC
                                            WHERE TC.wish_id = W.wish_id
                                        ) AS tag_ids
                                    FROM wish AS W
                                    WHERE W.wish_id = $1;`, [id]);
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
            throw new Error("Unable to create wish.")
        }
        return new Wish(res.rows[0]);
    }

    async update(type, value) {
        const formattedQuery = format("UPDATE wish SET %I = $1 WHERE wish_id = $2 RETURNING wish_id;", type);
        const res = await db.query(formattedQuery, [value, this.id]);
        if (res.rows.length != 1) {
            throw new Error("Unable to update wish.")
        }
        const updatedWish = await Wish.getOneById(this.id);
        return updatedWish;
    }
};

module.exports = Wish;