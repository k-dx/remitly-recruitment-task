import { expect } from "chai";
import request from "supertest";
import { app } from "@/index.js";
import { pool } from "@/db.js";

describe("GET /v1/swift-codes/:countryISO2", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should return swift codes along with country details", async () => {
    await pool.query(
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)",
      ["US", "UNITED STATES"]
    );
    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["123 MAIN ST", "TEST BANK", "US", "TESTUS33XXX"]
    );
    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["456 MAIN ST", "SECOND BANK", "US", "TESTUS44YYY"]
    );

    const res = await request(app)
      .get("/v1/swift-codes/country/US")
      .expect(200);

    expect(res.body).to.have.property("countryISO2", "US");
    expect(res.body).to.have.property("countryName", "UNITED STATES");
    expect(res.body).to.have.property("swiftCodes");
    expect(res.body.swiftCodes).to.be.an("array").with.length(2);

    const swiftCode = res.body.swiftCodes.find(
      (sc: any) => sc.swiftCode === "TESTUS33XXX"
    );
    expect(swiftCode).to.exist;
    expect(swiftCode).to.have.property("address", "123 MAIN ST");
    expect(swiftCode).to.have.property("bankName", "TEST BANK");
    expect(swiftCode).to.have.property("isHeadquarter", true);
  });

  it("should return 404 if country is not found", async () => {
    const res = await request(app)
      .get("/v1/swift-codes/country/XX")
      .expect(404);

    expect(res.body).to.have.property("message", "Country not found");
  });
});
