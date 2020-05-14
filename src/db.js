const mongoose = require('mongoose');
const { DB_URI } = require('./config/secret');
const colors = require('colors');

async function connect() {

    await mongoose.connect(DB_URI, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    }).then(() => console.log(`${colors.yellow('DATABASE IS CONNECTED!')}`));

};

module.exports = { connect };