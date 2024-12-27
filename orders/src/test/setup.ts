import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

//panggil jest mocks untuk keperluan test
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  //memasukkan JWT_KEY palsu untuk kebutuhan 
  //Testing function saja
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  //deklarasi MongoMemoryServer
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(await mongoUri, {});
});

beforeEach(async () => {
  //refresh mocks agar kosong sblum di test
  jest.clearAllMocks();

  //fungsi mengkoneksikan dengan database
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    //hapus semua data yang ada dalam database default
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  //hentikan koneksi database
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

//buat sendiri fungsi authenticate tanpa harus menggunakan
//bantuan dari service auth
global.signin = () => {
  // Build a JWT payload.  { id, email }
  // id build id user uniq, agar berbeda setiap generate user for test
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
