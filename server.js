const http = require('http');

http.createServer((req, res)=> {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`200`);
}).listen(5000,() => console.log('Сервер создан'));

