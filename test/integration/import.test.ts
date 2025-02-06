import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { __TEST__, importTsv } from "@/import.js";
import { pool } from "@/db.js";

describe("loadTsv", () => {
  const workDir = process.cwd();
  const loadTsv = __TEST__.loadTsv;
  const filename = "test_dummy.tsv";
  const filepath = path.join(workDir, "data", filename);

  afterEach(() => {
    fs.unlinkSync(filepath);
  });

  it("should parse TSV content into an array of objects", async () => {
    const fakeContent =
      "COUNTRY ISO2 CODE\tSWIFT CODE\tCODE TYPE\tNAME\tADDRESS\tTOWN NAME\tCOUNTRY NAME\tTIME ZONE\nUS\tTESTUS33XXX\tBIC\tTEST BANK\t123 MAIN ST\tNEW YORK\tUNITED STATES\tEST\nUS\tTESTUS33ABC\tBIC\tTEST BANK\t456 SECOND ST\tNEW YORK\tUNITED STATES\tEST\nPL\tTESTUS33POL\tBIC\tTEST BANK\tUL. PAWIA 17, 12-345 KRAKÓW\tKRAKÓW\tPOLAND\tWarsaw/Berlin\n";
    fs.writeFileSync(filepath, fakeContent);

    const result = await loadTsv(filename);
    expect(result).to.deep.equal([
      {
        countryISO2Code: "US",
        swiftCode: "TESTUS33XXX",
        codeType: "BIC",
        name: "TEST BANK",
        address: "123 MAIN ST",
        townName: "NEW YORK",
        countryName: "UNITED STATES",
        timeZone: "EST",
      },
      {
        countryISO2Code: "US",
        swiftCode: "TESTUS33ABC",
        codeType: "BIC",
        name: "TEST BANK",
        address: "456 SECOND ST",
        townName: "NEW YORK",
        countryName: "UNITED STATES",
        timeZone: "EST",
      },
      {
        countryISO2Code: "PL",
        swiftCode: "TESTUS33POL",
        codeType: "BIC",
        name: "TEST BANK",
        address: "UL. PAWIA 17, 12-345 KRAKÓW",
        townName: "KRAKÓW",
        countryName: "POLAND",
        timeZone: "Warsaw/Berlin",
      },
    ]);
  });

  it("should handle empty TSV content", async () => {
    const fakeContent = "";
    fs.writeFileSync(filepath, fakeContent);

    const result = await loadTsv(filename);
    expect(result).to.deep.equal([]);
  });

  it("should handle TSV content with only headers", async () => {
    const fakeContent = "country ISO2 Code\tname";
    fs.writeFileSync(filepath, fakeContent);

    const result = await loadTsv(filename);
    expect(result).to.deep.equal([]);
  });
});

describe("insertCountries", () => {
  const insertCountries = __TEST__.insertCountries;

  beforeEach(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should insert countries into the database", async () => {
    const countries = [
      { iso2: "US", name: "UNITED STATES" },
      { iso2: "PL", name: "POLAND" },
    ];

    await insertCountries(countries);

    const countriesResult = await pool.query("SELECT * FROM countries_iso2");
    expect(countriesResult.rowCount).to.equal(2);
    expect(countriesResult.rows).to.deep.equal([
      { country_iso2: "US", country_name: "UNITED STATES" },
      { country_iso2: "PL", country_name: "POLAND" },
    ]);
  });
});

describe("insertBanks", () => {
  const insertBanks = __TEST__.insertBanks;

  beforeEach(async () => {
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
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  it("should insert banks into the database", async () => {
    const banks = [
      {
        countryISO2Code: "US",
        swiftCode: "TESTUS33XXX",
        name: "TEST BANK",
        address: "123 MAIN ST",
      },
      {
        countryISO2Code: "PL",
        swiftCode: "TESTPL33XXX",
        name: "TEST BANK PL",
        address: "UL. PAWIA 17, 12-345 KRAKÓW",
      },
    ];

    await insertBanks(banks);

    const swiftCodesResult = await pool.query("SELECT * FROM swift_codes");
    expect(swiftCodesResult.rowCount).to.equal(2);

    expect(swiftCodesResult.rows[0]).to.have.property("country_iso2", "US");
    expect(swiftCodesResult.rows[0]).to.have.property(
      "swift_code",
      "TESTUS33XXX"
    );
    expect(swiftCodesResult.rows[0]).to.have.property("bank_name", "TEST BANK");
    expect(swiftCodesResult.rows[0]).to.have.property("address", "123 MAIN ST");

    expect(swiftCodesResult.rows[1]).to.have.property("country_iso2", "PL");
    expect(swiftCodesResult.rows[1]).to.have.property(
      "swift_code",
      "TESTPL33XXX"
    );
    expect(swiftCodesResult.rows[1]).to.have.property(
      "bank_name",
      "TEST BANK PL"
    );
    expect(swiftCodesResult.rows[1]).to.have.property(
      "address",
      "UL. PAWIA 17, 12-345 KRAKÓW"
    );
  });
});

describe("importTsv", () => {
  const workDir = process.cwd();
  const filename = "test_dummy.tsv";
  const filepath = path.join(workDir, "data", filename);

  beforeEach(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  after(async () => {
    await pool.query("DELETE FROM swift_codes");
    await pool.query("DELETE FROM countries_iso2");
  });

  afterEach(() => {
    fs.unlinkSync(filepath);
  });

  it("should import TSV data into the database", async () => {
    const fakeContent = `COUNTRY ISO2 CODE\tSWIFT CODE\tCODE TYPE\tNAME\tADDRESS\tTOWN NAME\tCOUNTRY NAME\tTIME ZONE
US\tTESTUS33XXX\tBIC\tTEST BANK\t123 MAIN ST\tNEW YORK\tUNITED STATES\tEST
US\tTESTUS33ABC\tBIC\tTEST BANK\t456 SECOND ST\tNEW YORK\tUNITED STATES\tEST
PL\tTESTUS33POL\tBIC\tTEST BANK\tUL. PAWIA 17, 12-345 KRAKÓW\tKRAKÓW\tPOLAND\tWarsaw/Berlin\n`;
    fs.writeFileSync(filepath, fakeContent);

    await importTsv(filename);

    const swiftCodesResult = await pool.query("SELECT * FROM swift_codes");
    expect(swiftCodesResult.rowCount).to.equal(3);

    const countriesResult = await pool.query("SELECT * FROM countries_iso2");
    expect(countriesResult.rowCount).to.equal(2);
  });

  it("should clear the tables before import", async () => {
    const fakeContent = `COUNTRY ISO2 CODE\tSWIFT CODE\tCODE TYPE\tNAME\tADDRESS\tTOWN NAME\tCOUNTRY NAME\tTIME ZONE
US\tTESTUS33XXX\tBIC\tTEST BANK\t123 MAIN ST\tNEW YORK\tUNITED STATES\tEST
US\tTESTUS33ABC\tBIC\tTEST BANK\t456 SECOND ST\tNEW YORK\tUNITED STATES\tEST
PL\tTESTUS33POL\tBIC\tTEST BANK\tUL. PAWIA 17, 12-345 KRAKÓW\tKRAKÓW\tPOLAND\tWarsaw/Berlin\n`;
    fs.writeFileSync(filepath, fakeContent);

    await pool.query(
      "INSERT INTO countries_iso2 (country_iso2, country_name) VALUES ($1, $2)",
      ["DE", "GERMANY"]
    );
    await pool.query(
      "INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address) VALUES ($1, $2, $3, $4)",
      ["DE", "TESTDE33XXX", "TEST BANK", "123 MAIN ST"]
    );

    await importTsv(filename);

    const swiftCodesResult = await pool.query("SELECT * FROM swift_codes");
    expect(swiftCodesResult.rowCount).to.equal(3);

    const countriesResult = await pool.query("SELECT * FROM countries_iso2");
    expect(countriesResult.rowCount).to.equal(2);
  });
});
