import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import userRouter from './routes/user.router';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MemoryStore from 'memorystore';
import requestRouter from './routes/request.router';

dotenv.config();

// create instance of express
var app = express();

//
app.use(cors({origin:process.env.CLIENT, credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'whatever',
  store: new (MemoryStore(session))({checkPeriod: 86400000}),
  cookie: {}}));

//root directory of static files
export const publicRoot = (path.join(__dirname, '../public'));

// used to point to the root directory of the static files
app.use(express.static(publicRoot));

// set routers
app.use('/users', userRouter);
app.use('/requests', requestRouter);

/*
    if someone makes a request that isn't handled by a router,
    catch 404's and forward to error handler
*/
app.use(function(req, res, next) {
    next(createError(404));
  });
  // error handler
  app.use(function(err: any, req: any, res: any, next: Function) {
    // Send error file
    res.status(err.status || 500);
    res.send('Error!');
  });
  
  module.exports = app;