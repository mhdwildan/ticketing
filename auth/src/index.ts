// $ npm Install mongoose @types/mongoose
import mongoose from 'mongoose';

import { app } from './app';

//function untuk mengkoneksikan auth app dengan DB mongoose
const start = async () => {
  console.log('Service auth Starting Engine System..');
  //periksa apakah Env Variable JWT_KEY ada (env di auth-depl.yaml)
  if (!process.env.JWT_KEY) {
    throw new Error ("JWT_KEY Must be defined");
  }
  //periksa apakah Env Variable MONGO_URI ada (env di auth-depl.yaml)
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }


  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

//run function
start();
