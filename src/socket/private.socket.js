const socketPrivate = (io) => {

    io.on('connection', (client) => {

        console.log('User is Connected');

        client.on('join chat', (params) => {
            client.join(params.room1);
            client.join(params.room2);
        });

        client.on('start-typing', (data) => {
            io.to(data.receiver).emit('is-typing', {...data, typing:true});
        });

        client.on('stop-typing', (data) => {
            io.to(data.receiver).emit('is-typing', {...data, typing:false});
        });

    });

};

module.exports = { socketPrivate };