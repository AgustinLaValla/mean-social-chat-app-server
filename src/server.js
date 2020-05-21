const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cokieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');
const userRoutes = require('./routes/user.routes');
const friendsRoutes = require('./routes/friends.routes');
const { socketStreams } = require('./socket/streams.socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true, limit: '50mb'}));
app.use(cokieParser());
app.use(cors());

//routes
app.use('/api/chatapp/auth',authRoutes);
app.use('/api/chatapp/posts', postsRoutes);
app.use('/api/chatapp/user', userRoutes);
app.use('/api/chatapp/friends', friendsRoutes);

//Socket Streams
socketStreams(io);

module.exports = { server , app};
