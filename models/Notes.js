const db = require('../db');

const {NotFoundError} = require("../ExpressErrors");

class Notes {
    static async createNote(userInfo, date){
        const {id} = userInfo;

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [id]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let creationDate = new Date(date);
        
        let response = await db.query(`
            INSERT INTO notes
            (date_created, last_modified, user_id)
            VALUES
            ($1, $2, $3)
            RETURNING id, 
            date_created AS "dateCreated", 
            last_modified AS "lastModified";
        `, [creationDate, creationDate, id]);
        
        return response.rows[0];
    }

    static async getNotes(userId){

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let response = await db.query(`
            SELECT id, content, date_created AS "dateCreated", last_modified AS "lastModified"
            FROM notes
            WHERE user_id = $1;
        `, [userId]);
        
        return response.rows;
    }

    static async updateNote(note, userId, date){

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let response = await db.query(`
            UPDATE notes
            SET content = $1, last_modified = $2
            WHERE user_id = $3 AND id = $4
            RETURNING id, content;
        `, [note.content, date, userId, note.id]);
        return response.rows[0];
    }

    static async deleteNote(userId, noteId){

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let response = await db.query(`
        DELETE FROM notes
        WHERE user_id = $1 AND id = $2;
        `, [userId, noteId]);
        return;
    }

};

module.exports = Notes;