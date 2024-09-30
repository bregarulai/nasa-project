import request from "supertest";

import app from "../../app.js";
import { mongoConnect, mongoDisconnect } from "../../services/mongo.js";
import { loadPlanetsData } from "../../models/planets.model.js";
import { loadLaunchData } from "../../models/launches.model.js";

describe("Planets API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
    await loadPlanetsData();
    await loadLaunchData();
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
