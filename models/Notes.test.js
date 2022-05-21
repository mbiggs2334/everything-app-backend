"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require('../ExpressErrors');
const Notes = require("./Notes");
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

describe("create note", () => {
    let userInfo = {
        id: 1
    };

    let date = new Date();

    test("it works", async() => {
        
        let res = await Notes.createNote(userInfo, date);
        
        expect(res).toEqual({
            id: expect.any(Number),
            dateCreated: expect.any(Date),
            lastModified: expect.any(Date)
          });
    });

    test("entering a non existing user id throws exception", () => {
        expect(async() => {
            await Notes.createNote({id: 6500}, date);
        }).rejects.toThrow("User not found", NotFoundError);
    });

});

describe("get notes", () => {

    test("it works", async() => {
        let res = await Notes.getNotes(1);
        expect(res).toEqual([{
            content: expect.any(String),
            id: expect.any(Number),
            dateCreated: expect.any(Date),
            lastModified: expect.any(Date)
        }]);
    });

    test("entering a non existing user id throws exception", () => {
        expect(async() => {
            await Notes.createNote(6500);
        }).rejects.toThrow("User not found", NotFoundError);
    });

});

describe("update note", () => {
    let date = new Date();
    let newNoteInfo = {
        id: 1,
        content: 'new note',
        dateCreated: date,
        lastModified: date
    };

    test("note before and after update is correct", async() => {
        let res = await Notes.getNotes(1);
        expect(res[0].content).not.toEqual("new note");
        await Notes.updateNote(newNoteInfo, 1, date);
        res = await Notes.getNotes(1);
        expect(res[0].content).toEqual("new note");
    });

    test("entering a non existing user id throws exception", () => {
        expect(async() => {
            await Notes.updateNote(newNoteInfo, 6500, date);
        }).rejects.toThrow("User not found", NotFoundError);
    });

});

describe('delete note', () => {

    test("it works", async() => {
        await Notes.deleteNote(1, 1);
        let res = await db.query(`
        SELECT content
        FROM notes
        WHERE id = $1 AND user_id = $2;
        `[1, 1]);
        expect(res.rows.length).toEqual(0);
    });

    test("entering a non existing user id throws exception", () => {
        expect(async() => {
            await Notes.deleteNote(6500, 1);
        }).rejects.toThrow("User not found", NotFoundError);
    });

});