DROP DATABASE IF EXISTS everything_app_test;
CREATE DATABASE everything_app_test;

\connect everything_app_test;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1)
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content TEXT,
    date_created TIMESTAMPTZ NOT NULL,
    last_modified TIMESTAMPTZ NOT NULL,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    time text NOT NULL,
    day_of_event text NOT NULL,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE
);