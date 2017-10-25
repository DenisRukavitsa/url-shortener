const http = require("http");
const url = require("url");

// Starting the server
function start(route, handle) {
  http.createServer (function (request, response) {
    request.setEncoding("utf8");
    route(handle, url.parse(request.url).pathname, response, request);
  }).listen(process.env.PORT);
  console.log("Server has started.");
}

exports.start = start;
