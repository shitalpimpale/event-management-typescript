import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server";

let mongoServer: MongoMemoryServer;
let token: string; // Assume a user needs to be logged in

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }


  const res = await request(app).post("/auth/login").send({
    email: "rishank@gmail.com",
    password: "123456",
  });

  token = res.body.token;
  console.log("token",token)
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Events API Tests", () => {
  let eventId: string;

  // ✅ Test: Create an Event
  test("Should create a new event", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tech Conference",
        description: "A great tech event",
        category: "conference",
        date: "2025-06-15T10:00:00.000Z",
        location: "New York",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    eventId = res.body._id; // Store event ID for further tests
  });

  // ✅ Test: Get All Events
  test("Should fetch all events", async () => {
    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ Test: Get Single Event by ID
  test("Should fetch a single event", async () => {
    const res = await request(app).get(`/api/events/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(eventId);
  });

  // ✅ Test: Update an Event
  test("Should update an event", async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Tech Conference" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Tech Conference");
  });

  // ✅ Test: Delete an Event
  test("Should delete an event", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Event deleted successfully");

    // Confirm event no longer exists
    const checkRes = await request(app).get(`/events/${eventId}`);
    expect(checkRes.status).toBe(404);
  });
});
