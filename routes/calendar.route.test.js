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

describe("POST /calendar/new", () => {
    const eventInfo = {
        title: "title",
        description: "description",
        time: "05:30",
        date: "05/18/1994",
        userId: 1
    };
    
    test("it works", async() => {

        const resp = await request(app)
        .post('/calendar/new')
        .send({eventInfo: {...eventInfo}})
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body.response).toEqual(expect.any(Object));
        expect(resp.body.error).toEqual(undefined);

    });

    test("unauthorized user returns error", async() => {

        const resp = await request(app)
        .post('/calendar/new')
        .send({eventInfo: {...eventInfo}})

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});

describe("PATCH /calendar/edit", () => {

    const eventInfo = {
        title: "new title",
        description: "new description",
        time: "05:30",
        date: "05/18/1994",
        userId: 1,
        eventId: 1
    };

    test("it works", async() => {

        const resp = await request(app)
        .patch("/calendar/edit")
        .send({eventInfo: {...eventInfo}})
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body.response).toEqual(expect.any(Object));
        expect(resp.body.error).toEqual(undefined);

    });

    test("non authorized user returns error", async() => {

        const resp = await request(app)
        .patch('/calendar/edit')
        .send({eventInfo: {...eventInfo}})

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});

describe("DELETE /calendar/delete", () => {

    const eventInfo = {
        userId: 1,
        eventId: 1
    };

    test("it works", async() => {

        const resp = await request(app)
        .delete('/calendar/delete')
        .send({
            eventInfo: {...eventInfo}
        })
        .set("authorization", `Bearer ${user1token}`);

        expect(resp.body.response).toEqual(expect.any(Object));
        expect(resp.body.error).toEqual(undefined);

    });

    test("non authorized user returns error", async() => {

        const resp = await request(app)
        .delete('/calendar/delete')
        .send({eventInfo: {...eventInfo}})

        expect(resp.body.error.message).toEqual("Unauthorized");
        expect(resp.body.error.status).toEqual(401);

    });

});