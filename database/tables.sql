
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS tag_connection;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS wish;
DROP TYPE IF EXISTS WISH_STATUS;

CREATE TYPE WISH_STATUS AS ENUM ('asked', 'granted', 'denied');

CREATE TABLE IF NOT EXISTS wish (
    wish_id INT GENERATED ALWAYS AS IDENTITY,
    wish_text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP,
    wish_status WISH_STATUS DEFAULT 'asked',
    votes_grant INT DEFAULT 0,
    votes_deny INT DEFAULT 0,
    reported INT DEFAULT 0,
    PRIMARY KEY(wish_id)
);

CREATE TABLE IF NOT EXISTS comment (
    comment_id INT GENERATED ALWAYS AS IDENTITY,
    comment_text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP,
    wish_id INT NOT NULL,
    parent_id INT,
    votes_agree INT DEFAULT 0,
    votes_disagree INT DEFAULT 0,
    reported INT DEFAULT 0,
    PRIMARY KEY(comment_id),
    FOREIGN KEY(wish_id) REFERENCES wish(wish_id),
    FOREIGN KEY(parent_id) REFERENCES comment(comment_id)
);

CREATE TABLE IF NOT EXISTS tag (
    tag_id INT GENERATED ALWAYS AS IDENTITY,
    tag_text VARCHAR(50) NOT NULL,
    PRIMARY KEY(tag_id)
);

CREATE TABLE IF NOT EXISTS tag_connection (
    tag_connection_id INT GENERATED ALWAYS AS IDENTITY,
    wish_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY(tag_connection_id),
    FOREIGN KEY(wish_id) REFERENCES wish(wish_id),
    FOREIGN KEY(tag_id) REFERENCES tag(tag_id)
);