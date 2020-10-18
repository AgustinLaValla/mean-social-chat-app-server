const socketStreams = (io, User, _) => {

    const user = new User();

    io.on('connection', (client) => {

        console.log('User is Connected');

        client.on('online', (data) => {
            client.join(data.room);
            user.enterRoom(client.id, data.username, data.room);
            const list = user.getUsersName(data.room);
            io.emit('usersOnline', _.uniq(list));
        });

        client.on('disconnect', () => {
            currentUser = user.removeUser(client.id);
            if (currentUser) {
                const usersArray = _.uniq(user.getUsersName(currentUser.room));
                io.emit('usersOnline', usersArray);
            };
        });

        client.on('logout', () => {
            currentUser = user.removeUser(client.id);
            if (currentUser) {
                console.log(currentUser);
                const usersArray = _.uniq(user.getUsersName(currentUser.room));
                io.emit('usersOnline', usersArray);
            };
        })

        client.on('refresh-posts', ({newPostAdded}) => io.emit('refresh-posts', { newPostAdded }))

        client.on('refresh-posts-comments', () => io.emit('refresh-posts-comments'));

        client.on('friend-list-refresh', () => io.emit('friend-list-refresh'));

        client.on('refresh-chat', () => io.emit('refresh-chat'));

        client.on('refresh-images', () => io.emit('refresh-images'));

        client.on('profile-pic-updated', () => io.emit('friend-list-refresh'));
    });
};

module.exports = { socketStreams };