const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require("../ExpressErrors");
const {
    authenticateJWT,
    ensureLoggedIn,
} = require('./auth');

const { SECRET_KEY } = require('../config');
const testToken = jwt.sign({username: "test"}, SECRET_KEY);
const badToken = jwt.sign({username: "test"}, "wrong");

describe("authenticateJWT", () => {
    test("it works", () => {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${testToken}` } };
        const res = { locals: {} };
        const next = function (err) {
          expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({
          user: {
            iat: expect.any(Number),
            username: "test",
          },
        });
      });
    
      test("works: no header", function () {
        expect.assertions(2);
        const req = {};
        const res = { locals: {} };
        const next = function (err) {
          expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
      });
    
      test("works: invalid token", function () {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${badToken}` } };
        const res = { locals: {} };
        const next = function (err) {
          expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
      });
    });
    
    
    describe("ensureLoggedIn", function () {
      test("works", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: { user: { username: "test" }}};
        const next = function (err) {
          expect(err).toBeFalsy();
        };
        ensureLoggedIn(req, res, next);
      });
    
      test("unauth if no login", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: {} };
        const next = function (err) {
          expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureLoggedIn(req, res, next);
      });
    });
    