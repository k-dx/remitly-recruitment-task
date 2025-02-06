import request from "supertest";
import { app } from "@/index.js";
import { expect } from "chai";
import { pool } from "@/db.js";

const endpoint = "/v1/swift-codes";

describe(`GET ${endpoint}/:swiftCode`, () => {
  before(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");

    await pool.query(
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)",
      ["US", "UNITED STATES"]
    );

    await pool.query(
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)",
      ["PL", "POLAND"]
    );

    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["123 MAIN ST", "TEST BANK", "US", "TESTUS33XXX"]
    );

    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["456 SECOND ST", "TEST BANK", "US", "TESTUS33ABC"]
    );

    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["UL. PAWIA 17", "TEST BANK", "PL", "TESTUS33POL"]
    );
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should retrieve details of a headquarter SWIFT code", async () => {
    const swiftCode = "TESTUS33XXX";
    const response = await request(app)
      .get(`${endpoint}/${swiftCode}`)
      .expect(200);

    expect(response.body).to.have.property("address");
    expect(response.body).to.have.property("bankName");
    expect(response.body).to.have.property("countryISO2");
    expect(response.body).to.have.property("countryName");
    expect(response.body).to.have.property("isHeadquarter", true);
    expect(response.body).to.have.property("swiftCode", swiftCode);
    expect(response.body).to.have.property("branches");
    expect(response.body.branches).to.be.an("array");
    expect(response.body.branches.length).to.be.greaterThan(0);

    const branchesAreNotHeadquarters = response.body.branches.every(
      (b: any) => b.isHeadquarter === false
    );
    expect(branchesAreNotHeadquarters).to.be.true;

    expect(response.body.branches.every((b: any) => b.swiftCode !== swiftCode))
      .to.be.true;
  });

  it("should retrieve details of a branch SWIFT code", async () => {
    const swiftCode = "TESTUS33POL";
    const response = await request(app)
      .get(`${endpoint}/${swiftCode}`)
      .expect(200);

    expect(response.body).to.have.property("address");
    expect(response.body).to.have.property("bankName");
    expect(response.body).to.have.property("countryISO2");
    expect(response.body).to.have.property("countryName");
    expect(response.body).to.have.property("isHeadquarter", false);
    expect(response.body).to.have.property("swiftCode", swiftCode);
    expect(response.body).not.to.have.property("branches");
  });

  it("should return 404 for a non-existent SWIFT code", async () => {
    const swiftCode = "NONEXISTENT";
    await request(app).get(`${endpoint}/${swiftCode}`).expect(404);
  });
});
