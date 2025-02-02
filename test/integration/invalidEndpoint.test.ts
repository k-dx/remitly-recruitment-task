import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/index.js";

describe("non-existent endpoint", () => {
  it("should return a proper message for GET method", async () => {
    const res = await request(app).get("/nonexistent").send().expect(404);
    expect(res.body.message).to.equal("Endpoint not found");
  });

  it("should return a proper message for POST method", async () => {
    const res = await request(app).post("/nonexistent").send().expect(404);
    expect(res.body.message).to.equal("Endpoint not found");
  });

  it("should return a proper message for DELETE method", async () => {
    const res = await request(app).delete("/nonexistent").send().expect(404);
    expect(res.body.message).to.equal("Endpoint not found");
  });
});
