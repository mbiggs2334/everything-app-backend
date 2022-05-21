const {parseMonth} = require('./regex');

describe("parseMonth", () => {
    let date;
    test("it works", () => {
        date = "02/23/1531";
        let parsedDate = parseMonth(date);
        expect(parsedDate).toEqual(["02", "23"]);
    });
});