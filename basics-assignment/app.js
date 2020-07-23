var http = require('http');
var routes = require('./routes')

const server = http.createServer(routes.handler);

server.listen(3000)