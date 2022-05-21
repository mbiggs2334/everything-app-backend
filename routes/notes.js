const express = require('express');
const router = express.Router();
const {ensureLoggedIn} = require('../middleware/auth');

const Notes = require('../models/Notes');

router.post('/new', ensureLoggedIn, async(req, res, next) => {
    try {
        const {user, date} = req.body;
        let response = await Notes.createNote(user, date);
        return res.json({response});
    } catch(e) {
        return next(e);
    };
});

router.patch('/update', ensureLoggedIn, async(req, res, next) => {
    try {
        const {note, userId, date} = req.body;
        let response = await Notes.updateNote(note, userId, date);
        return res.status(200).json({message: "Update Successful."});
    } catch(e){
        return next(e);
    };
});

router.delete('/delete', ensureLoggedIn, async(req, res, next) => {
    try {
        const {noteId, userId} = req.body;
        let response = await Notes.deleteNote(userId, noteId);
        return res.status(202).json({message: 'Deletion Successful'});
    } catch(e){
        return next(e);
    }
});

module.exports = router;