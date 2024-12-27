// @ts-nocheck
import express from 'express';
// command : npm i express-async-errors
import 'express-async-errors';
import { json } from 'body-parser';
// $ npm install cookie-session @types/cookie-session
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@mwdtickets/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

//inisiasi express framework yg berfungsi untuk manajemen 
//route didalam app
const app = express();
//setting proxy terpoercaya karena engine x diblock oleh browser
app.set('trust proxy', true);
//middleware untuk express untuk mengkandle dg format json
app.use(json());
//setup Cookie Session
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

//mendaftarkan beberapa route yang dimiliki service auth
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//tangkap jika ada route yang tidak dikenal
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

//middleware untuk mengelola pesan Error
app.use(errorHandler);

export { app };