import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/index.js";
import { pool } from "../../src/db.js";
import sinon from "sinon";

describe("POST /v1/swift-codes", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    sinon.restore();
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
    pool.end();
  });

  it("should successfully insert a new SWIFT code", async () => {
    const payload = {
      address: "123 MAIN ST",
      bankName: "TEST BANK",
      countryISO2: "US",
      countryName: "UNITED STATES",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    const res = await request(app)
      .post("/v1/swift-codes")
      .send(payload)
      .expect(201);

    expect(res.body.message).to.equal("Swift code inserted successfully");

    const result = await pool.query(
      "SELECT * FROM swift_codes WHERE swift_code = $1",
      [payload.swiftCode]
    );
    expect(result.rowCount).to.equal(1);
  });

  it("should return 400 when the query is malformed", async () => {
    const payload = {
      address: "123 MAIN ST",
      bankName: "TEST BANK",
      countryISO2: "US",
      countryName: "UNITED STATES",
      isHeadquarter: true,
    };

    const res = await request(app)
      .post("/v1/swift-codes")
      .send(payload)
      .expect(400);

    expect(res.body.message).to.equal("Missing required fields");
  });

  it("should return 409 when the SWIFT code already exists", async () => {
    const payload = {
      address: "123 MAIN ST",
      bankName: "TEST BANK",
      countryISO2: "US",
      countryName: "UNITED STATES",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    // Insert the SWIFT code first
    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      [
        payload.address,
        payload.bankName,
        payload.countryISO2,
        payload.swiftCode,
      ]
    );

    const res = await request(app)
      .post("/v1/swift-codes")
      .send(payload)
      .expect(409);

    expect(res.body.message).to.equal(
      "Bank with the given swift code already exists"
    );
  });

  it("should return 500 for an internal server error", async () => {
    const payload = {
      address: "123 MAIN ST",
      bankName: "TEST BANK",
      countryISO2: "US",
      countryName: "UNITED STATES",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    // Simulate an internal server error by throwing an error in the query
    sinon.stub(pool, "query").throws(new Error("Internal server error"));

    const res = await request(app)
      .post("/v1/swift-codes")
      .send(payload)
      .expect(500);

    expect(res.body.message).to.equal("Internal server error");
  });
});
