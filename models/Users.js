const db = require('../db');
const bcrypt = require('bcrypt');

const Notes = require('./Notes');
const Calendar = require('./Calendar');

const {BCRYPT_WORK_FACTOR} = require('../config');

const {BadRequestError, UnauthorizedError} = require('../ExpressErrors');

class User {

    static async registerUser(userInfo){
        const {username, password, email} = userInfo;
        const promises = [];
        const errorMessages = []

        promises.push(db.query(`
        SELECT username 
        FROM users
        WHERE username = $1
        `, [username]));
        promises.push(db.query(`
        SELECT email 
        FROM users
        WHERE email = $1 
        `, [email]));

        await Promise.all(promises)
        .then( data => {
            if(data[0].rows.length > 0) errorMessages.push('Username already in use.');
            if(data[1].rows.length > 0) errorMessages.push('Email already in use.')
        });

        if(errorMessages.length > 0) throw new BadRequestError(errorMessages);

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const res = await db.query(`
            INSERT INTO users
            (username, password, email)
            VALUES
            ($1, $2, $3)
            RETURNING id, username, email
        `, [username, hashedPassword, email]);
        const user = res.rows[0];
        user.notes = [];
        user.events = [];
        return user;
    }

    static async authenticate(username, password){
        const response = await db.query(`
        SELECT id, username, password, email
        FROM users
        WHERE username = $1
        `, [username]);

        if(!response.rows[0]){
            throw new BadRequestError("Invalid username/password.");
        }

        const user = response.rows[0];
        const hashedPassword = user.password;
        const validPass = await bcrypt.compare(password, hashedPassword);

        if(!validPass){
            throw new BadRequestError("Invalid username/password.");
        };
        delete user.password;
        user.notes = await Notes.getNotes(user.id);
        user.events = await Calendar.getEvents(user.id);
        return user;
    }

    static async verifyPassword(username, password){
        const response = await db.query(`
        SELECT id, username, password, email
        FROM users
        WHERE username = $1
        `, [username]);

        if(!response.rows[0]){
            throw new BadRequestError("Invalid username/password.");
        }

        const user = response.rows[0];
        const hashedPassword = user.password;
        const validPass = await bcrypt.compare(password, hashedPassword);

        if(!validPass){
            throw new BadRequestError("Invalid username/password.");
        };
        delete user.password;
        return user;
    }

    static async changePassword(username, password, id){
        const newPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const response = await db.query(`
            UPDATE users
            SET password = $1
            WHERE username = $2 and id = $3
            RETURNING id, username;
        `, [newPassword, username, id]);

        if(!response.rows[0]) throw new BadRequestError("Something went wrong");

        return response.rows[0];
    }

    static async changeUsername(currentUsername, requestedUsername, id){
        const duplicateCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1;
        `, [requestedUsername]);

        if(duplicateCheck.rows.length > 0) throw new BadRequestError("Username Already Taken.");

        const response = await db.query(`
            UPDATE users
            SET username = $2
            WHERE username = $1 and id = $3
            RETURNING id, username, email;
        `, [currentUsername, requestedUsername, id]);

        const user = response.rows[0];
        
        user.notes = await Notes.getNotes(user.id);
        return user;
    }

}

module.exports = User;