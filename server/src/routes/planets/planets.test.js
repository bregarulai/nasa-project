import request from "supertest";

import app from "../../app.js";
import { mongoConnect, mongoDisconnect } from "../../services/mongo.js";

describe("Planets API", () => {
  beforeEach(async () => {
    await mongoConnect();
  });

  afterEach(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /api/v1/planets", () => {
    test("Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/api/v1/planets")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
