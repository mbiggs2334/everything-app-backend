function parseMonth(date){
    return [date.match(/[0-9]*[0-9]/g)[0], date.match(/[0-9]*[0-9]/g)[1]];
};
module.exports = {
    parseMonth
}