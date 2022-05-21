"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require('../ExpressErrors');
const Calendar = require("./Calendar");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

let emptyEventInfo = {
    title: '',
    description: '',
    time: '',
    date: '',
    userId: 2
};


describe("getEvents", () => {

    test("it works", async() => {
        let res = await Calendar.getEvents(1);
        expect(res).toEqual(
            {
                "05": {
                    "18": [{id: expect.any(Number),
                        title: "event1",
                        description: "event1 description",
                        time: "04:32",
                        day_of_event: "05/18/2023",
                        user_id: 1}]
                },
                "06": {
                    "08": [{id: expect.any(Number),
                        title: "event3",
                        description: "event3 description",
                        time: "23:23",
                        day_of_event: "06/08/2023",
                        user_id: 1}]
                }
            }
        );
    });

    test("entering a non existing user id throws exception", () => {
        expect(async() => {
            await Calendar.getEvents(65);
        }).rejects.toThrow("User not found", NotFoundError);
    });

});

describe("addEvents", () => {
    let eventInfo = {
        title: 'title',
        description: 'description',
        time: '05:40',
        date: '05/18/1994',
        userId: 2
    };

    let eventInfoWithBadUserId = {
        title: 'title',
        description: 'description',
        time: '05:40',
        date: '05/18/1994',
        userId: 6500
    };

    test('it works', async() => {
        let res = await Calendar.addEvent(eventInfo);
        expect(res).toEqual({
            "09": {
                "18": [{
                        id: expect.any(Number),
                        title: "event2",
                        description: "event2 description",
                        time: "15:52",
                        day_of_event: "09/18/2023",
                        user_id: 2
                }]
            },
            "05": {
                "18": [{
                    id: expect.any(Number),
                    title: 'title',
                    description: 'description',
                    time: '05:40',
                    day_of_event: '05/18/1994',
                    user_id: 2
                }]
            }
        })
        
    });

    test("entering empty data throw errors", () => {
        expect(async() => {
            await Calendar.addEvent(emptyEventInfo);
        }).rejects.toThrow("Data cannot be empty", BadRequestError);
    });

    test("entering a non existing user id throws exception", () => {
        expect(async() => {
            await Calendar.addEvent(eventInfoWithBadUserId);
        }).rejects.toThrow("User not found", NotFoundError);
    });

});

describe("delete event", () => {
    let eventInfo = {
        eventId: 1,
        userId: 1,
    };

    test("existence of event before and after deletion", async() => {
        let res = await db.query(`
        SELECT id, title
        FROM events
        WHERE user_id = $1 AND id = $2;
        `, [eventInfo.userId, eventInfo.eventId]);
    
        expect(res.rows.length).not.toEqual(0);

        await Calendar.deleteEvent(eventInfo);

        res = await db.query(`
        SELECT id, title
        FROM events
        WHERE user_id = $1 AND id = $2;
        `, [eventInfo.userId, eventInfo.eventId]);

        expect(res.rows.length).toEqual(0);

    });
    
    test("entering a non existing user id throw exception", () => {
        expect(async() => {
            await Calendar.deleteEvent({eventId: 1, userId: 6500});
        }).rejects.toThrow("User not found", NotFoundError);
    });

});

describe("edit event", () => {
    let newEventInfo = {
        eventId: 1,
        title: 'new title',
        description: 'new description',
        time: '05:40',
        date: '05/18/1994',
        userId: 1
    };

    let eventInfoWithBadUserId = {
        eventId: 1,
        title: 'new title',
        description: 'new description',
        time: '05:40',
        date: '05/18/1994',
        userId: 6500
    };

    test("it works", async() => {
        await Calendar.editEvent(newEventInfo);

        let res = await db.query(`
            SELECT title, description
            FROM events
            WHERE id = $1
        `, [newEventInfo.eventId]);

        expect(res.rows[0].title).toEqual('new title');
        expect(res.rows[0].description).toEqual('new description');

    });

    test("entering a non existing user id throw exception", () => {
        expect(async() => {
            await Calendar.editEvent(eventInfoWithBadUserId);
        }).rejects.toThrow("User not found", NotFoundError);
    });

    test("entering empty data throw errors", () => {
        expect(async() => {
            await Calendar.addEvent(emptyEventInfo);
        }).rejects.toThrow("Data cannot be empty", BadRequestError);
    });

});