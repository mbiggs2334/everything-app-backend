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

describe("POST /notes/new", () => {

    let date = new Date();

    test("it works", async() => {

        const resp = await request(app)
        .post('/notes/new')
        .send({
            user: {
                id: 1
            },
            date
        })
        .set("authorization", `Bearer ${user1token}`)

        expect(resp.body.response).toEqual({
            id: expect.any(Number),
            dateCreated: expect.any(String),
            lastModified: expect.any(String)
        });

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .post('/notes/new')
        .send({
            user: {
                id: 1
            },
            date
        })

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});

describe("PATCH /notes/update", () => {

    let date = new Date();

    test("it works", async() => {

        const resp = await request(app)
        .patch('/notes/update')
        .send({
            note: {
                title: 'new title',
                description: 'new description',
            },
            userId: 1,
            date
        })
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body.message).toEqual("Update Successful.");

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .patch('/notes/update')
        .send({
            user: {
                id: 1
            },
            date
        })

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});

describe("DELETE /notes/delte", () => {

    test("it works", async() => {

        const resp = await request(app)
        .delete('/notes/delete')
        .send({
            noteId: 1,
            userId: 1
        })
        .set("authorization", `Bearer ${user1token}`)

        expect(resp.body.message).toEqual("Deletion Successful");

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .delete('/notes/delete')
        .send({
            noteId: 1,
            userId: 1
        })

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});
