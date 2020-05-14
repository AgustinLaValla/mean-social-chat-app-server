const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

const { SEED } = require('../config/secret');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ ok: false, message: 'No Token Provided' });

    try {
        const decoded = await jwt.verify(token, SEED);
        req.user = decoded;
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