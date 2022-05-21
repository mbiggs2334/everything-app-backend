const db = require('../db');
const {parseMonth} = require('../helpers/regex');

const {NotFoundError, BadRequestError} = require('../ExpressErrors');
const Users = require("./Users");


class Calendar {
    static async getEvents(userId){

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let res = await db.query(`
            SELECT id, title, description, time, day_of_event, user_id
            FROM events
            WHERE user_id = $1
        `, [userId]);
        
        const eventMonthsIndexed = {};
        for(let event of res.rows){
            let [monthIndex, dayIndex] = parseMonth(event.day_of_event);
            if(eventMonthsIndexed[monthIndex] && eventMonthsIndexed[monthIndex][dayIndex]){
               eventMonthsIndexed[monthIndex][dayIndex].push(event);
            } else if(eventMonthsIndexed[monthIndex] && !eventMonthsIndexed[monthIndex][dayIndex]){
                eventMonthsIndexed[monthIndex][dayIndex] = [];
                eventMonthsIndexed[monthIndex][dayIndex].push(event);
            } else if(!eventMonthsIndexed[monthIndex]){
                eventMonthsIndexed[monthIndex] = {};
                eventMonthsIndexed[monthIndex][dayIndex] = [];
                eventMonthsIndexed[monthIndex][dayIndex].push(event);
            };
        };
        return eventMonthsIndexed;
    }

    static async addEvent(eventInfo){
        const {title, description, time, date} = eventInfo;
        if(title === '' || description === '' || time === '' || date === ''){
            throw new BadRequestError("Data cannot be empty");
        };
        const userId = parseInt(eventInfo.userId);

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let res = await db.query(`
            INSERT INTO events
            (title, description, time, day_of_event, user_id)
            VALUES
            ($1, $2, $3, $4, $5)
        `, [title, description, time, date, userId]);
        const events = await this.getEvents(userId);
        return events;
    }

    static async deleteEvent(eventInfo){
        const {eventId, userId} = eventInfo;

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let res = await db.query(`
            DELETE FROM events
            WHERE id = $1
            AND user_id = $2
        `, [eventId, userId]);
        const events = await this.getEvents(userId);
        return events;
    }

    static async editEvent(eventInfo){
        const {title, description, time, date, eventId, userId} = eventInfo;

        if(title === '' || description === '' || time === '' || date === ''){
            throw new BadRequestError("Data cannot be empty");
        };

        let checkForUser = await db.query(`
        SELECT id, username
        FROM users
        WHERE id = $1;
        `, [userId]);

        if(checkForUser.rows.length === 0) throw new NotFoundError("User not found");

        let res = await db.query(`
            UPDATE events
            SET title = $1, description = $2, time = $3, day_of_event = $4
            WHERE id = $5
        `, [title, description, time, date, eventId]);
        const events = await this.getEvents(userId);
        return events;
    }
}

module.exports = Calendar;