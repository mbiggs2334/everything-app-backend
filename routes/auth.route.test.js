"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/token", () => {

    test("works", async() => {
        const resp = await request(app)
        .post("/auth/token")
        .send({
            username: 'testuser1',
            password: 'password1'
        });
        expect(resp.body).toEqual({
            token: expect.any(String),
            user: {
                id: 1,
                username: 'testuser1',
                email: 'test1@email.com',
                notes: expect.any(Array),
                events: expect.any(Object)
            }
        });
    });

    test("sign in with non existing user", async() => {

        const res = await request(app)
        .post("/auth/token")
        .send({
            username: 'null',
            password: 'null'
        });
        expect(res.body.error.status).toEqual(400);
        expect(res.body.error.message).toEqual('Invalid username/password.');
    });

    test("throws exception with incorrect JSON properties", async() => {
        const res = await request(app)
        .post("/auth/token")
        .send({
            user: 'testuser1',
            pass: 'password1'
        });
        expect(res.body).toEqual( {
            error: {
              message: [
                'instance is not allowed to have the additional property "user"',
                'instance is not allowed to have the additional property "pass"',
                'instance requires property "username"',
                'instance requires property "password"'
              ],
              status: 400
            }
          });
    });

});