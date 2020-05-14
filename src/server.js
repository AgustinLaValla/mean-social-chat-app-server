const express = require('express');
const cokieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');

const server = express();

//settings
server.set('port', process.env.PORT || 3000);

//middlewares
server.use(express.json({limit: '50mb'}));
server.use(express.urlencoded({extended:true, limit: '50mb'}));
server.use(cokieParser());
server.use(morgan('dev'));
server.use(cors());

//routes
server.use('/api/chatapp/auth',authRoutes);
server.use('/api/chatapp/posts', postsRoutes);

module.exports = server;
