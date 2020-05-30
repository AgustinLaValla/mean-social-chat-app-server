class User {
    constructor() {
        this.globalRoom = [];
    };

    enterRoom(socketId, username, room) {
        const user = { id: socketId, name: username, room };
        this.globalRoom.push({ ...user });
        return user;
    };

    getUser(socketId) {
        return this.globalRoom.find(user => user.id === socketId);
    };

    removeUser(socketId) {
        const user = this.getUser(socketId);
        this.globalRoom = this.globalRoom.filter((user) => user.id != socketId);
        return user;
    };

    getUsersName(room) { 
        const users = this.globalRoom.filter(user => user.room === room);
        return users.map(user => user.name);
    };
};

module.exports = { User };