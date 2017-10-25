const server = require("./server");
const router = require("./router");
const requestHandlers = require("./requestHandlers");

const handle = {};
handle["/"] = requestHandlers.shortener;
handle["/shortener"] = requestHandlers.shortener;

server.start(router.route, handle);
