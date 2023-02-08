const format = require("pg-format");

const db = require("../database/connect");

class Comment {

    constructor({ comment_id, comment_text, created_at, wish_id, parent_id, votes_agree, votes_disagree, reported }) {
        this.id = comment_id;
        this.text = comment_text;
        this.createdAt = created_at;
        this.wish_id = wish_id;
        this.parent_id = parent_id;
        this.votes_agree = votes_agree;
        this.votes_disagree = votes_disagree;
        this.reported = reported;
    };

    static async getAllByWishId(wishId, idsOnly=false) {
        
        let res;

        if (idsOnly) {
            res = await db.query("SELECT comment_id FROM comment WHERE wish_id = $1", [wishId]);
            return res.rows.map(r => r.comment_id);
        } else {
            res = await db.query("SELECT * FROM comment WHERE wish_id = $1", [wishId]);
            return res.rows.map(r => new Comment(r));
        }
    }

    static async getOneByWishIdAndId (wishId, commentId) {
        const res = await db.query("SELECT * FROM comment WHERE comment_id = $1 AND wish_id = $2", [commentId, wishId]);

        if (res.rows.length != 1) {
            throw new Error("Unable to locate comment.")
        } else {
            const comment = new Comment(res.rows[0]);
            return comment;
        };

    }

    static async create (text, wishId, parentId) {
        const res = await db.query("INSERT INTO comment (comment_text, wish_id, parent_id) VALUES ($1, $2, $3) RETURNING *;",
                                    [text, wishId, parentId]);
        if (res.rows.length != 1) {
            throw new Error("Unable to create comment.")
        }
        return new Comment(res.rows[0]);
    }
    
    async update(type, value) {
        const formattedQuery = format("UPDATE comment SET %I = $1 WHERE comment_id = $2 AND wish_id = $3 RETURNING comment_id;", type);
        const res = await db.query(formattedQuery, [value, this.id, this.wish_id]);
        if (res.rows.length != 1) {
            throw new Error("Unable to update comment.")
        }
        const updatedWish = await Comment.getOneByWishIdAndId(this.wish_id, this.id);
        return updatedWish;
    }
};

module.exports = Comment;