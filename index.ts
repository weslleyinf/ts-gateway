import { AssemblyRouter } from './src/router/assembly-router';
import { IRouter } from './src/router/i.router';
import { Server, createServer } from 'http';
import { of } from './src/shared/utils';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';

const app: express.Application = express()
const hostname: string = '127.0.0.1';
const port:number = 3000;

app.all('*', async (req, res, next) => {
  const router: IRouter = new AssemblyRouter(app);
  const [err] = await of(router.generatePipeline(req, res, next));
  if(err) res.status(404).json(err);
  else next();
});

app.all('/teste', async (req, res, next) => {
  console.log(req);
  next();
});

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server: Server = createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
