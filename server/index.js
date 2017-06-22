var http = require('http');
var path = require('path')
var fs = require('fs');
var url = require('url');

var clientPath = path.join(__dirname, '../client');

var server = http.createServer(function (req, res) {
    var urlData = url.parse(req.url, true);
    if (urlData.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(clientPath, 'index.html')).pipe(res);
    } else if (urlData.pathname === '/api/chirps') {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            fs.createReadStream(path.join(__dirname, 'data.json')).pipe(res);
        } else if (req.method === 'POST') {
            fs.readFile(path.join(__dirname, 'data.json'), 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server Error');
                } else {
                    //turns json data into javascript array
                    var chirps = JSON.parse(data);
                    var incomingData = '';
                    req.on('data', function (chunk) {
                        incomingData += chunk;
                    });
                    req.on('end', function () {
                        var newChirps = JSON.parse(incomingData);
                        chirps.push(newChirps);
                    
                        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(chirps), function (err) {
                            if (err) {
                                console.log(err)
                                res.writeHead(500, {'Content-Type': 'text/plain'});
                                res.end('Internal server Error');
                            } else {
                                res.writeHead(201);
                                res.end();
                            }
                        });
                    });
                }
            });
        }
    } else if (req.method === 'GET') {
        //Need to try to read requested file from client folder
        var filePath = path.join(clientPath, urlData.pathname)
        var readStream = fs.createReadStream(filePath);
        readStream.on('error', function (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File Not Found');
        });
        var extension = path.extname(filePath);
        var contentType;

        switch (extension) {
            case '.html':
                contentType = 'text/html'
                break;
            case '.css':
                contentType = 'text/css'
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            default:
                contentType = 'text/plain';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        readStream.pipe(res);
    }

});

server.listen(3000);