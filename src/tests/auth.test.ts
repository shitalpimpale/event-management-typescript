import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server";
//import User from "../models/User";

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

describe("Authentication API Tests", () => {
  test("Should register a new user", async () => {
    const res = await request(app).post("/auth/signup").send({
      "name" : "Shubhangi", "email" : "shub12@gmail.com", "password": "123456", "role" : "organizer"
  });

    expect(res.status).toBe(200);
   // expect(res.body.message).toBe("User registered successfully");
  });

  test("Should not allow duplicate email registration", async () => {
    const res = await request(app).post("/auth/signup").send({
      "name" : "Shubhangi", "email" : "shub6@gmail.com", "password": "123456", "role" : "organizer"
  });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  test("Should login an existing user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "shub4@gmail.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Should access protected route with valid token", async () => {
    const res = await request(app)
      .get("/protected/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
   // expect(res.body.email).toBe("shub4@gmail.com");
  });
});
