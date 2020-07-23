const http = require("http");
var routes = require('./routes');

const server = http.createServer(routes)

server.listen(3000);
