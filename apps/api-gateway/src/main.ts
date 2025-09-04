/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
// import * as path from 'path';

import cors from 'cors';

import proxy from "express-http-proxy";

import morgan from 'morgan'; 

import rateLimit from 'express-rate-limit';


import swagerUi from 'swagger-ui-express';

import axios from 'axios';

import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin : ['http://localhost:3000'],
    allowedHeaders :['Content-Type', 'Authorization'],
    credentials : true
  }
));

app.use(morgan('dev'));

app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({limit : "100mb", extended: true }));

app.use(cookieParser());

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (it is based on miliseconds)
  max: (req:any)=> (req.user ? 1000 : 100), // limit login users to 1000 requests per windowMs, and for non-login users to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req:any) => req.ip + (req.user ? req.user.id : ''), // if the user is logged in, we will use the user id as well
});

app.use(limiter);

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/', proxy('http://localhost:6001'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
