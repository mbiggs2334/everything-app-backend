const bcrypt = require('bcrypt');

const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const {createToken} = require('../helpers/tokens');

async function commonBeforeAll() {

    await db.query(`DROP TABLE events;`);
    await db.query(`DROP TABLE notes;`);
    await db.query(`DROP TABLE users;`);

    await db.query(`CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL
            CHECK (position('@' IN email) > 1)
    );`);

    await db.query(`CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        content TEXT,
        date_created TIMESTAMPTZ NOT NULL,
        last_modified TIMESTAMPTZ NOT NULL,
        user_id INTEGER NOT NULL
            REFERENCES users ON DELETE CASCADE
    );`);
    
    await db.query(`CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        time text NOT NULL,
        day_of_event text NOT NULL,
        user_id INTEGER NOT NULL
            REFERENCES users ON DELETE CASCADE
    );`);

    await db.query(`
    INSERT INTO users (username, password, email)
    VALUES ('testuser1', $1, 'test1@email.com'),
           ('testuser2', $2, 'test2@email.com');
    ` , [await bcrypt.hash('password1', BCRYPT_WORK_FACTOR), await bcrypt.hash('password2', BCRYPT_WORK_FACTOR)]);

    await db.query(`
    INSERT INTO events (title, description, time, day_of_event, user_id)
    VALUES ('event1', 'event1 description', '04:32', '05/18/2023', 1),
           ('event2', 'event2 description', '15:52', '09/18/2023', 2),
           ('event3', 'event3 description', '23:23', '06/08/2023', 1);
    `);

    await db.query(`
    INSERT INTO notes (content, date_created, last_modified, user_id)
    VALUES ('note1', '2022-05-16 10:42:08.124-04', '2022-05-16 10:50:38.393-04', 1),
           ('note2', '2022-05-11 10:06:35.155-04', '2022-05-11 10:06:48.855-04', 2);
    `);

};

async function commonBeforeEach() {
    await db.query('BEGIN');
  }
  
  async function commonAfterEach() {
    await db.query('ROLLBACK');
  }
  
  async function commonAfterAll() {
    await db.end();
  }
  
  const user1token = createToken('testuser1');
  const user2token = createToken('testuser2');

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    user1token,
    user2token
};