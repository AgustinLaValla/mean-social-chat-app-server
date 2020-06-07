const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cokieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');
const userRoutes = require('./routes/user.routes');
const friendsRoutes = require('./routes/friends.routes');
const messageRoutes = require('./routes/message.routes');
const imageRoutes = require('./routes/image.routes');
const { socketStreams } = require('./socket/streams.socket');
const { socketPrivate } = require('./socket/private.socket');

const { User } = require('./helpers/user-class.helper');
const _ = require('lodash');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


//middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true, limit: '50mb'}));
app.use(cokieParser());
app.use(cors({credentials:true, origin:true}));
app.options('*',cors());

//routes
app.use('/api/chatapp/auth',authRoutes);
app.use('/api/chatapp/posts', postsRoutes);
app.use('/api/chatapp/user', userRoutes);
app.use('/api/chatapp/friends', friendsRoutes);
app.use('/api/chatapp/chat-messages', messageRoutes);
app.use('/api/chatapp/images', imageRoutes);

//Socket Streams
socketStreams(io, User, _);

//Socket Private Chat
socketPrivate(io);

module.exports = { server , app};
