const http = require("http");
const https = require("https");

function shortener(response, request) {

    // writing headers
    response.writeHead(200, {"Content-Type": "text/json"});
    response.writeHead(200, {"Access-Control-Allow-Origin": "*"});

    // getting the data
    let data = '';
    request.on("data", chunk => {
        data += chunk;
    });

    // parsing the http/https response
    const parseResponse = (res) => {
        const { statusCode } = res;
        const { statusMessage } = res;
        if (statusCode >= 400) {
            response.write(JSON.stringify({error: statusCode + ' ' + statusMessage}));
            response.end();
        } else {
            response.write(JSON.stringify({error: 'no'}));
            response.end();
        }
    };

    // writing error to the response
    const writeError = (error) => {
        response.write(JSON.stringify({error: error.message}));
        response.end();
    };

    // got all the data
    request.on("end", () => {
        // trying to get the passed URL with error handling
        try {
            if (data.startsWith('https')) {
                https.get(data, parseResponse).on('error', (e) => {
                    writeError(e);
                });
            } else {
                http.get(data, parseResponse).on('error', (e) => {
                    writeError(e);
                });
            }
        } catch (e) {
            writeError(e);
        }
    });
}

exports.shortener = shortener;
