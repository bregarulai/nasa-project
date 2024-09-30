import request from "supertest";
import app from "./app.js";

describe("Test GET /", () => {
  test("Should respond with 200 success", async () => {
    const response = await request(app).get("/").expect("Content-Type", /html/);
  });
});
