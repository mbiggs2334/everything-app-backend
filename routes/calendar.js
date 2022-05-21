const express = require('express');
const router = express.Router();
const {ensureLoggedIn} = require('../middleware/auth');

const Calendar = require('../models/Calendar');

router.post('/new', ensureLoggedIn, async(req, res, next) => {
    try{
        const {eventInfo} = req.body;
        let response = await Calendar.addEvent(eventInfo);
        return res.json({response});
    } catch(e){
        return next(e);
    }
    
});

router.patch('/edit', ensureLoggedIn, async(req, res, next) => {
    try{
        const {eventInfo} = req.body;
        let response = await Calendar.editEvent(eventInfo);
        return res.json({response});
    } catch(e){
        return next(e);
    }
});

router.delete('/delete', ensureLoggedIn, async(req, res, next) => {
    try{
        const {eventInfo} = req.body;
        let response = await Calendar.deleteEvent(eventInfo);
        return res.json({response});
    } catch(e){
        return next(e);
    }
});



module.exports = router;