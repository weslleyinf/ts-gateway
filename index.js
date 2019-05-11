const http = require('http');
const express = require('express')
const httpProxy = require('express-http-proxy')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');

const app = express()
const hostname = '127.0.0.1';
const port = 3000;

// const userServiceProxy = httpProxy('http://localhost:3001');
// Proxy request
// app.get('/users', (req, res, next) => {
//   userServiceProxy(req, res, next);
// })

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
