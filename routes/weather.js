const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');

router.get('/current', async(req, res, next) => {
    const {searchQuery} = res.req.query;
    try {
        let data = await Weather.getCurrentAndForecastWeather(searchQuery);
        return res.json(data);
    } catch(e){
        return next(e);
    };
});

module.exports = router;