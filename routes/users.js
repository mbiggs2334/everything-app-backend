const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const {ensureLoggedIn} = require('../middleware/auth');

const {createToken} = require('../helpers/tokens');

router.post('/register', async(req, res, next) => {
    const {username, password, email} = req.body;
    try {
        let newUser = await User.registerUser({username, password, email});
        const token = createToken(newUser);
        return res.json({token, user: newUser});
    } catch(e){
        return next(e);
    };
});

router.patch('/username/edit', ensureLoggedIn, async(req, res, next) => {
    const {currentUsername, requestedUsername, id} = req.body;
    try {
        let updatedUser = await User.changeUsername(currentUsername, requestedUsername, id);
        return res.json({user: updatedUser});
    } catch(e){
        return next(e);
    }
});

router.put('/password/verify', ensureLoggedIn, async(req, res, next) => {
    const {username, password} = req.body;
    try {
        let response = await User.verifyPassword(username, password);
        if(response) return res.json({verified: true});
    } catch(e){
        return next(e);
    };
});

router.patch('/password/edit', ensureLoggedIn, async(req, res, next) => {
    const {username, password, id} = req.body;
    try{ 
        let response = await User.changePassword(username, password, id);
        return res.json({passwordChanged: true})
    } catch(e){
        return next(e);
    }
});

module.exports = router;