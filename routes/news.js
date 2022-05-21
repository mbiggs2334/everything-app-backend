const express = require('express');
const router = express.Router();

const News = require('../models/News');

router.get('/get', async(req, res, next) => {
    try {
        const {skip} = res.req.query;
        let response = await News.getNewsStories(`${skip}`);
        return res.json(response);
    } catch(e) {
        return next(e);
    };
});

module.exports = router;