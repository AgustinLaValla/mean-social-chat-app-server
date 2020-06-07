const mongoose = require('mongoose');
const colors = require('colors');
const { config } = require('dotenv');

config();

const DB_URI = process.env.DB_URI;

async function connect() {

    await mongoose.connect(DB_URI, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify:false
    }).then(() => console.log(`${colors.yellow('DATABASE IS CONNECTED!')}`));

};

module.exports = { connect };