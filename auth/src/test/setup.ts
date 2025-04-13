import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Start the in-memory MongoDB instance
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // Connect Mongoose to the in-memory MongoDB instance
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  // Get collections from the in-memory database and clear them
  const collections = await mongoose.connection.db?.collections();

  // Check if collections is undefined
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } else {
    console.error(
      "Failed to access collections: mongoose.connection.db is undefined"
    );
  }
});

afterAll(async () => {
  // Stop the in-memory MongoDB instance and close the Mongoose connection
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Ensure that signin always returns a string[] (array of strings)
global.signin = async (): Promise<string[]> => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  // Get the cookie from the response headers
  const cookie = response.get("Set-Cookie");

  // If cookie is undefined, return an empty array (to satisfy type requirements)
  return cookie ? cookie : [];
};
