const {createToken} = require('./tokens');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

describe("createToken", () => {
    let user = {username: "mbiggs"}
    test("it works", () => {
        let token = createToken(user);
        let payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({username: "mbiggs", iat: expect.any(Number)});
    });
});