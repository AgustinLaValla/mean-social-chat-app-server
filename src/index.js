const { server, app } = require('./server');
const { connect } = require('./db');
const colors = require('colors');

const port = process.env.PORT || 3000;

async function main() {
    try {
        await connect();
        await server.listen(port);
        console.log(`${colors.magenta('Server on port')} ${colors.green(port)}`);
    } catch (error) {
        console.log(error);
    };
};

main();
