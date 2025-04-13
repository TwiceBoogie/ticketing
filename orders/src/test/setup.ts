import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

process.env.JWT_KEY = "random_key_here";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
declare global {
  var signin: () => string[]; // Explicitly type the return type
}

jest.mock("../nats-wrapper");
jest.mock("../stripe-client");

let mongo: any;
beforeAll(async () => {
  // Create an in-memory MongoDB server
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // Connect to the in-memory MongoDB instance
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks(); // Clear mocks to reset any spy or mock function

  // Safely check if mongoose.connection.db is available
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    // Delete all documents from each collection for a clean slate
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } else {
    console.error("Mongoose connection db is undefined");
  }
});

afterAll(async () => {
  if (mongo) {
    // Stop the in-memory MongoDB instance and close the Mongoose connection
    await mongo.stop();
  }
  await mongoose.connection.close(); // Close the Mongoose connection
});

global.signin = (): string[] => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT using the JWT_KEY environment variable
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn the session object into a JSON string
  const sessionJSON = JSON.stringify(session);

  // Encode the session JSON as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Return the session cookie as an array
  return [`session=${base64}`];
};
