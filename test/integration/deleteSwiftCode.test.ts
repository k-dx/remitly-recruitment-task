import { expect } from "chai";
import request from "supertest";
import { app } from "@/index.js";
import { pool } from "@/db.js";

describe("DELETE /v1/swift-codes/:swiftCode", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should delete an existing swift code and country if no other records exist", async () => {
    // Insert a swift code record and its country
    await pool.query(
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)",
      ["US", "UNITED STATES"]
    );
    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["123 MAIN ST", "TEST BANK", "US", "TESTUS33XXX"]
    );

    // Delete the inserted swift code
    const res = await request(app)
      .delete("/v1/swift-codes/TESTUS33XXX")
      .expect(200);

    expect(res.body.message).to.equal("Swift code deleted successfully");

    // Verify the swift code was removed
    const swiftResult = await pool.query(
      "SELECT * FROM swift_codes WHERE swift_code = $1",
      ["TESTUS33XXX"]
    );
    expect(swiftResult.rowCount).to.equal(0);

    // Since it was the only record for this country, the country row should also get deleted
    const countryResult = await pool.query(
      "SELECT * FROM countries_iso2 WHERE country_iso2 = $1",
      ["US"]
    );
    expect(countryResult.rowCount).to.equal(0);
  });

  it("should delete a swift code without removing the country if other swift codes exist for that country", async () => {
    // Insert a country and two swift codes for the same country
    await pool.query(
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)",
      ["US", "UNITED STATES"]
    );
    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["123 MAIN ST", "TEST BANK", "US", "TESTUS33XXX"]
    );
    // Insert another swift code for the same country
    await pool.query(
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)",
      ["456 MAIN ST", "ANOTHER BANK", "US", "TESTUS44YYY"]
    );

    // Delete one swift code
    const res = await request(app)
      .delete("/v1/swift-codes/TESTUS33XXX")
      .expect(200);

    expect(res.body.message).to.equal("Swift code deleted successfully");

    // Verify the deleted swift code is gone
    const deletedResult = await pool.query(
      "SELECT * FROM swift_codes WHERE swift_code = $1",
      ["TESTUS33XXX"]
    );
    expect(deletedResult.rowCount).to.equal(0);

    // The country should still exist because another swift code is still using it
    const countryResult = await pool.query(
      "SELECT * FROM countries_iso2 WHERE country_iso2 = $1",
      ["US"]
    );
    expect(countryResult.rowCount).to.equal(1);
  });

  it("should return 404 when the swift code does not exist", async () => {
    const res = await request(app)
      .delete("/v1/swift-codes/NONEXISTENT")
      .expect(404);
    expect(res.body.message).to.equal("Swift code not found");
  });
});
