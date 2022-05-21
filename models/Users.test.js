"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require('../ExpressErrors');
const User = require("./Users");
const Users = require('./Users');
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

describe("register user", () => {
    let userInfo = {
        username: "user3",
        password: "password",
        email: "test3@email.com"
    };

    test("it works", async() => {
        let res = await Users.registerUser(userInfo);
        expect(res).toEqual({
            id: expect.any(Number),
            username: "user3",
            email: "test3@email.com",
            notes: expect.any(Array),
            events: expect.any(Array)
        });
        let dbQuery = await db.query(`
            SELECT id, username
            FROM users
            WHERE username = $1;
        `, ["user3"]);
        expect(dbQuery.rows[0].username).toEqual("user3");
    });

    test("password was hashed", async() => {
        await Users.registerUser(userInfo);
        let res = await db.query(`
        SELECT password
        FROM users
        WHERE username = $1;
        `, ["user3"]);

        expect(res.rows[0].password[0]).toEqual("$");
        expect(res.rows[0].password).not.toEqual(userInfo.password);
    });

    test("registering taken username throws exception", async() => {
        await Users.registerUser(userInfo);
        expect(async() => {
            await Users.registerUser({
                ...userInfo,
                email: "email4@email.com"
            });
        }).rejects.toThrow(BadRequestError);
    })

    test("registering taken email throws exception", async() => {
        await Users.registerUser(userInfo);
        expect(async() => {
            await Users.registerUser({
                ...userInfo,
                username: "testuser5"
            });
        }).rejects.toThrow(BadRequestError);
    })

});

describe("authenticate user", () => {

    test("it works", async() => {
        let res = await Users.authenticate("testuser1", "password1");
        expect(res).toEqual({
            id: 1,
            username: 'testuser1',
            email: 'test1@email.com',
            notes: expect.any(Array),
            events: expect.any(Object)
          });
    });

    test("throws exception on invalid username", async() => {
        expect(async() => {
            await Users.authenticate("badUsername", "password1");
        }).rejects.toThrow(BadRequestError);
    });

    test("throws exception on invalid password", async() => {
        expect(async() => {
            await Users.authenticate("testuser1", "badPassword");
        }).rejects.toThrow(BadRequestError);
    });

});

describe("verify password", () => {

    test("it works", async() => {
        let res = await Users.verifyPassword("testuser1", "password1");
        expect(res).toEqual({
            id: expect.any(Number),
            username: 'testuser1',
            email: 'test1@email.com'
        });
    });

    test("throws exception on invalid username", async() => {
        expect(async() => {
            await Users.verifyPassword("badUsername", "password1");
        }).rejects.toThrow(BadRequestError);
    });

    test("throws exception on invalid password", async() => {
        expect(async() => {
            await Users.verifyPassword("testuser1", "badPassword");
        }).rejects.toThrow(BadRequestError);
    });

});

describe("change password", () => {

    test("it works", async() => {
        await Users.changePassword("testuser1", "newPassword", 1);
        let verifyNewPass = await User.verifyPassword("testuser1", "newPassword");
        expect(verifyNewPass).toEqual({ id: 1, username: 'testuser1', email: 'test1@email.com' });
    });

});

describe("change username", () => {

    test("it works", async() => {
        await Users.changeUsername("testuser1", "newUsername", 1);
        let res = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1 AND email = $2;
        `,["newUsername", "test1@email.com"]);
        expect(res.rows[0].username).toEqual("newUsername");
    });

    test("an already taken username throws exception", async() => {
        expect(async() => {
            await User.changeUsername("testuser1", "testuser2", 1);
        }).rejects.toThrow(BadRequestError);
    });

});