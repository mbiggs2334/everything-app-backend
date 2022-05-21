const express = require('express');
const router = express.Router();

const Crypto = require('../models/Crypto');

router.get('/marketvalue', async(req, res, next) => {
    try{
        let {id, currency} = res.req.query;
        let response = await Crypto.getMarketChart(id, currency);
        return res.json({response});
    } catch(e){
        console.log(e.response.data.error);
        if(e.response.data.error === "Could not find coin with the given id"){
            e.message = "Could not find coin with the given id";
            e.status = 404;
        };
        return next(e);
    };
});

module.exports = router;