"use strict";

const request = require("supertest");

const app = require("../app");
const Crypto = require("../models/Crypto");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeAll(() => {
    jest.spyOn(Crypto, "getMarketChart").mockResolvedValue({test: 'success'});
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /crypto/marketvalue", () => {

    test("it works", async() => {

        const resp = await request(app)
        .get('/crypto/marketvalue')
        .query({
            id: 'bitcoin',
            currency: 'usd'
        });

        expect(resp.body.response.test).toEqual("success");

    });

});
