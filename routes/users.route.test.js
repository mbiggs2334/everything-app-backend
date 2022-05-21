"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1token,
  user2token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

let newUser = {
    username: 'newUser',
    password: 'password',
    email: 'newemail@email.com'
};

describe("POST /users/register", () => {

    test("it works", async() => {

        const resp = await request(app)
        .post('/users/register')
        .send(newUser)

        expect(resp.body).toEqual({
            token: expect.any(String),
            user: {
                id: expect.any(Number),
                username: newUser.username,
                email: newUser.email,
                notes: expect.any(Array),
                events: expect.any(Array)
            }
        })

    });

});

describe("PATCH /users/username/edit", () => {

    test("it works", async() => {

        const resp = await request(app)
        .patch('/users/username/edit')
        .send({
            currentUsername: 'testuser1', 
            requestedUsername: 'newUsername', 
            id: 1
        })
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body).toEqual({
            user: {
                id: 1,
                username: 'newUsername',
                email: 'test1@email.com',
                notes: expect.any(Array)
            }
        });

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .patch('/users/username/edit')
        .send({
            currentUsername: 'testuser1', 
            requestedUsername: 'newUsername', 
            id: 1
        })

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});

describe('PUT /users/password/verify', () => {

    test("correct password returns true", async() => {

        const resp = await request(app)
        .put('/users/password/verify')
        .send({
            username: 'testuser1',
            password: 'password1'
        })
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body.verified).toEqual(true);

    });

    test("incorrect password returns false", async() => {

        const resp = await request(app)
        .put('/users/password/verify')
        .send({
            username: 'testuser1',
            password: 'wrongpassword'
        })
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body.error.message).toEqual("Invalid username/password.");
        expect(resp.body.error.status).toEqual(400);

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .put('/users/password/verify')
        .send({
            username: 'testuser1',
            password: 'wrongpassword'
        })

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});

describe("PATCH /users/password/edit", () => {

    test("it works", async() => {

        const resp = await request(app)
        .patch('/users/password/edit')
        .send({
            username: 'testuser1',
            password: 'newPassword',
            id: 1
        })
        .set("authorization", `Bearer ${user1token}`);
        
        expect(resp.body.passwordChanged).toEqual(true);

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .patch('/users/password/edit')
        .send({
            username: 'testuser1',
            password: 'newPassword',
            id: 1
        })

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});