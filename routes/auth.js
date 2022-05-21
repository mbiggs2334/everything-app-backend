const express = require('express');
const router = express.Router();

const jsonschema = require('jsonschema');
const userAuthSchema = require('../schemas/userAuth.json');
const {createToken} = require('../helpers/tokens');

const Users = require('../models/Users');
const { BadRequestError } = require('../ExpressErrors');

router.post('/token', async(req, res, next) => {
    try{
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid){
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        };

        const { username, password } = req.body;
        const user = await Users.authenticate(username, password);
        const token = createToken(user);
        return res.json({token, user: user});
    } catch(e){
        return next(e);
    };
});

module.exports = router;