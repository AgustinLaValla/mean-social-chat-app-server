const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');
const { config } = require('dotenv');

config();

const SEED = process.env.SEED;


const verifyToken = async (req, res, next) => {

    if(!req.headers.authorization) return res.status(httpStatus.UNAUTHORIZED).json({ ok: false, message: 'No Token Provided' });

    const token = req.cookies.auth || req.get('authorization').split(' ')[1];


    try {
        const decoded = await jwt.verify(token, SEED);
        req.user = decoded.user;

    } catch (error) {
        if (error.expiredAt < new Date())
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                ok: false,
                message: 'Token has expired. Please, login again',
                token: null
            });
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, mensaje: error });
    };
    
    next();
};


module.exports = { verifyToken };