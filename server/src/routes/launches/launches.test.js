import request from "supertest";

import app from "../../app.js";
import { mongoConnect, mongoDisconnect } from "../../services/mongo.js";

describe("Launches APi", () => {
  beforeEach(async () => {
    await mongoConnect();
  });

  afterEach(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /api/v1/launches", () => {
    test("Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/api/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /api/v1/launches", () => {
    const completeLaunchData = {
      mission: "Keppler Exploration X",
      rocket: "Explorer IS1",
      launchDate: "December 27, 2030",
      target: "Kepler-442 b",
    };
    const launchDataWithInvalidDate = {
      mission: "Keppler Exploration X",
      rocket: "Explorer IS1",
      launchDate: "hello",
      target: "Kepler-442 b",
    };

    const launchDataWithoutDate = {
      mission: "Keppler Exploration X",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };
    test("Should respond with 201 success", async () => {
      const response = await request(app)
        .post("/api/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toEqual(requestDate);

      expect(responseDate).toEqual(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("Should catch missing required fields", async () => {
      const response = await request(app)
        .post("/api/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required fields.",
      });
    });

    test("Should catch invalid launch dates", async () => {
      const response = await request(app)
        .post("/api/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid launch date." });
    });
  });

  describe("Test DELETE /api/v1/launches/:id", () => {
    const launchId = 100;
    test("Should respond with 200 success", async () => {
      const response = await request(app)
        .delete(`/api/v1/launches/${launchId}`)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    test("Should catch wrong launch id", async () => {
      const response = await request(app)
        .delete(`/api/v1/launches/1055`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toStrictEqual({ error: "Launch not found." });
    });
  });
});
