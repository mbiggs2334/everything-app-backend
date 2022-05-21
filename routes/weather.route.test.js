"use strict";

const request = require("supertest");

const app = require("../app");
const Weather = require("../models/Weather");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeAll(() => {
    jest.spyOn(Weather, "getCurrentAndForecastWeather").mockResolvedValue({test: 'success'});
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /weather/current", () => {

    test("it works", async() => {
        
        const resp = await request(app)
        .get('/weather/current')
        .query({
            searchQuery: 'hello'
        })

        expect(resp.body.test).toEqual("success");

    })

});