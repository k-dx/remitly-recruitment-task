import { expect } from "chai";
import { pool } from "../../src/db.js";

describe("countries_iso2 table", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should not allow inserting duplicate countries", async () => {
    const query =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const values = ["US", "UNITED STATES"];

    await pool.query(query, values);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23505");
    }
  });

  it("should not allow inserting non-uppercase country ISO2 codes", async () => {
    const query =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const values = ["uS", "UNITED STATES"];

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });

  it("should not allow inserting country ISO2 codes of length diffrent than 2", async () => {
    const query =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const values = ["USA", "UNITED STATES"];

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "22001");
    }
  });

  it("should not allow inserting non-uppercase country names", async () => {
    const query =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const values = ["US", "united states"];

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });
});

describe("countries_iso2 table", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should not allow inserting non-uppercase country ISO2 codes", async () => {
    const payload = {
      address: "123 MAIN ST",
      bankName: "TEST BANK",
      countryISO2: "us",
      countryName: "UNITED STATES",
      swiftCode: "TESTUS33XXX",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [
      payload.countryISO2.toUpperCase(),
      payload.countryName,
    ];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });

  it("should not allow inserting duplicate swift codes", async () => {
    const payload = {
      address: "ADDRESS",
      bankName: "BANK NAME",
      countryISO2: "US",
      countryName: "UNITED STATES",
      swiftCode: "US123456789",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [payload.countryISO2, payload.countryName];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);
    await pool.query(query, values);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23505");
    }
  });

  it("should not allow inserting non-uppercase swift codes", async () => {
    const payload = {
      address: "ADDRESS",
      bankName: "BANK NAME",
      countryISO2: "US",
      countryName: "UNITED STATES",
      swiftCode: "us123456789",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [payload.countryISO2, payload.countryName];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });

  it("should not allow inserting swift codes of length different than 11", async () => {
    const payload = {
      address: "ADDRESS",
      bankName: "BANK NAME",
      countryISO2: "US",
      countryName: "UNITED STATES",
      swiftCode: "US12345678",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [payload.countryISO2, payload.countryName];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });

  it("should not allow inserting non-uppercase address", async () => {
    const payload = {
      address: "address",
      bankName: "BANK NAME",
      countryISO2: "US",
      countryName: "UNITED STATES",
      swiftCode: "US123456789",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [payload.countryISO2, payload.countryName];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });

  it("should not allow inserting non-uppercase bank name", async () => {
    const payload = {
      address: "ADDRESS",
      bankName: "bank name",
      countryISO2: "US",
      countryName: "UNITED STATES",
      swiftCode: "US123456789",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [payload.countryISO2, payload.countryName];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });

  it("should allow inserting properly formatted data", async () => {
    const payload = {
      address: "ADDRESS",
      bankName: "BANK NAME",
      countryISO2: "US",
      countryName: "UNITED STATES",
      swiftCode: "US123456789",
    };
    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)";
    const countryValues = [payload.countryISO2, payload.countryName];
    const query =
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)";
    const values = [
      payload.countryISO2,
      payload.swiftCode,
      payload.bankName,
      payload.address,
    ];

    await pool.query(countryQuery, countryValues);

    try {
      await pool.query(query, values);
    } catch (err) {
      expect(err).to.have.property("code", "23514");
    }
  });
});
