const {WEATHER_API_KEY} = require('../config');
const axios = require('axios');

class Weather {
    static BASE_URL = 'http://api.weatherapi.com/v1';
    static errorMessages = {
        1003: 'Please enter a search term.',
        1005: 'Please enter a valid search term.',
        1006: 'No matching location found.',
        9999: 'Looks like there is some trouble completing your request.'
    };

    static async getCurrentAndForecastWeather(searchQuery){
        try {
            let url = `${this.BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${searchQuery}`;
            let res = await axios.get(url);
            return res.data;
        } catch(err){
            const {data: {error}} = err.response;
            return error.code;
        }
    }

};

module.exports = Weather;