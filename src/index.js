const server = require('./server');
const { connect } = require('./db');
const colors = require('colors');

const port = server.get('port');    

async function main() {
    await connect(); 
    await server.listen(3000);
    console.log(`${colors.magenta('Server on port')} ${colors.green(port)}`);
};

main();
