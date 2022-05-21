"use strict";

const request = require("supertest");

const app = require("../app");
const News = require("../models/News");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeAll(() => {
    jest.spyOn(News, "getNewsStories").mockResolvedValue({test: 'success'});
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /news/get", () => {

    test("it works", async() => {

        const resp = await request(app)
        .get('/news/get')

        expect(resp.body.test).toEqual('success');

    });

});

