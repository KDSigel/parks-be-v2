-- CREATE DATABASE parks;

DROP TABLE IF EXISTS users, comments, favorites;

-- need to change password to use hash?
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL
);

CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    parkcode VARCHAR NOT NULL,
    user_id INTEGER REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    comment VARCHAR(255) NOT NULL,
    parkcode VARCHAR NOT NULL,
    user_id INTEGER REFERENCES users(user_id)
        ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);