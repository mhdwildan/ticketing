import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  var signin: () => Promise<string[]>;
}

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

//fungsi untuk testing user authenticate is true
global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }
  return cookie;
};
