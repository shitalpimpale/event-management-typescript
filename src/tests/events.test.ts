import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server";

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Avoid reconnecting if already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Events API Tests", () => {
  test("Should create a new event", async () => {
    const res = await request(app).post("/events/").send({
        "title" : "Project Insighttt",
        "description" : "How are you",
        "category" : "seminar",
        "date" : "2025-04-11",
        "location" : "Nagar",
        "onlineLink" : "https:google.com"
    });

    expect(res.status).toBe(201);
   // expect(res.body.message).toBe("User registered successfully");
  });

});
