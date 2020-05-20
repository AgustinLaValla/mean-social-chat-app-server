const socketStreams = (io) => {

    io.on('connection', (client) => {

        console.log('User is Connected');

        io.on('disconnect', () => console.log('User connection has finished'));

        client.on('refresh-posts', (payload) => io.emit('refresh-posts', {data:'post-refresh-response'}))

        client.on('refresh-posts-comments', () => io.emit('refresh-posts-comments'));
    });
};

module.exports = { socketStreams };