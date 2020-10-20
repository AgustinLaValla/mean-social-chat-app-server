const User = require('../models/user.schema');
const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const { firstUpper } = require('../helpers/helpers');
const { genSalt, hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { config } = require('dotenv');


config();

const SEED = process.env.SEED;
const clientId = process.env.CLIENT_ID;

const client = new OAuth2Client(clientId);

const createUser = async (req, res) => {

    const { username, email, password } = req.body;

    const schema = Joi.object().keys({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    const { error, value } = schema.validate({ username, email, password });
    if (error) return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, message: error });

    const userEmailExists = await User.findOne({ email: email.toLowerCase() });
    if (userEmailExists) return res.status(HttpStatus.CONFLICT).json({ ok: false, message: 'Email already exists' });

    const usernameExists = await User.findOne({ username: firstUpper(username) });
    if (usernameExists) return res.status(HttpStatus.CONFLICT).json({ ok: false, message: 'User already exists' });


    const user = new User({ username: firstUpper(value.username), email: value.email.toLowerCase(), password });
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save()

    const data = { username: user.username, email: user.email, _id: user._id, google: user.google }
    const token = jwt.sign({ user: data }, SEED, { expiresIn: 4 * 60 * 60 });

    res.cookie('auth', token);
    return res.status(HttpStatus.CREATED).json({ ok: true, message: 'User Successfully Created', user, token });

};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        const { error, value } = schema.validate({ email, password });
        if (error) return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, message: error });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(HttpStatus.NOT_FOUND).json({ ok: false, message: 'User Not Found' });

        const isValid = await compare(password, user.password);
        if (!isValid) return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ ok: false, message: 'Email or password is wrong' });

        const data = { username: user.username, email: user.email, _id: user._id, google: user.google }
        const token = jwt.sign({ user: data }, SEED, { expiresIn: 4 * 60 * 60 });

        res.cookie('auth', token);
        return res.json({ ok: true, token, user });
    } catch (error) {
        console.log(error);
    };
}


const verify = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId
    });
    const payload = ticket.getPayload();
    return {
        username: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const googleUser = await verify(token);
        const user = await User.findOne({ email: googleUser.email });
        if (user) {
            if (!user.google) {
                return res.status(400).json({ ok: false, message: 'You should login with email and password' });
            } else {
                const data = { username: user.username, email: user.email, _id: user._id, google: user.google };
                const token = await jwt.sign({ user: data }, SEED, { expiresIn: '4h' });
                return res.json({ ok: true, token, user });
            }
        } else {
            const newUser = new User({
                username: googleUser.username,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)'
            });

            await newUser.save();

            const data = { username: newUser.username, email: newUser.email, _id: newUser._id, google: newUser.google };
            const token = jwt.sign({ user: data }, SEED, { expiresIn: '4h' });

            return res.json({ ok: true, user: data, token });

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Internal server error' });
    }

}


module.exports = { createUser, login, googleLogin };