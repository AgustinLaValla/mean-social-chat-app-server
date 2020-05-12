const mongoose = require('mongoose');
const dbConfig = require('./config/secret');
const colors = require('colors');

async function connect() {

    await mongoose.connect(dbConfig.DB_URI, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    }).then(() => console.log(`${colors.yellow('DATABASE IS CONNECTED!')}`));

};

module.exports = { connect };