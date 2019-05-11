import http from 'http';
import express from 'express';
import httpProxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';

const app: express.Application = express()
const hostname: string = '127.0.0.1';
const port:number = 3000;

const userServiceProxy = httpProxy('http://localhost:3001');
app.get('/users', (req, res, next) => {
  userServiceProxy(req, res, next);
})

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server: http.Server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
