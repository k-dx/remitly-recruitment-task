import * as fs from "fs";
import * as path from "path";
import CsvParser from "csv-parser";
import { pool } from "./db.js";
import { logger } from "./logger.js";

interface InputRow {
  "COUNTRY ISO2 CODE": string;
  "SWIFT CODE": string;
  "CODE TYPE": string;
  NAME: string;
  ADDRESS: string;
  "TOWN NAME": string;
  "COUNTRY NAME": string;
  "TIME ZONE": string;
}

interface Row {
  countryISO2Code: string;
  swiftCode: string;
  codeType: string;
  name: string;
  address: string;
  townName: string;
  countryName: string;
  timeZone: string;
}

interface OutputRow {
  countryISO2Code: string;
  swiftCode: string;
  name: string;
  address: string;
}

async function loadTsv(inputFileName: string): Promise<Row[]> {
  const workDir = process.cwd();
  const inputFilePath = path.join(workDir, "data", inputFileName);
  const readStream = fs.createReadStream(inputFilePath);

  const rows: Row[] = [];

  await new Promise((resolve, reject) => {
    readStream
      .pipe(CsvParser({ separator: "\t" }))
      .on("data", (inputRow: InputRow) => {
        const row: Row = {
          countryISO2Code: inputRow["COUNTRY ISO2 CODE"],
          swiftCode: inputRow["SWIFT CODE"],
          codeType: inputRow["CODE TYPE"],
          name: inputRow["NAME"],
          address: inputRow["ADDRESS"],
          townName: inputRow["TOWN NAME"],
          countryName: inputRow["COUNTRY NAME"],
          timeZone: inputRow["TIME ZONE"],
        };
        rows.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  return rows;
}

async function preprocess(input: Row[]): Promise<{
  banks: OutputRow[];
  countries: { iso2: string; name: string }[];
}> {
  const bankRows: OutputRow[] = [];
  const countries = new Map<string, string>();

  for (const inputRow of input) {
    const bankRow: OutputRow = {
      countryISO2Code: inputRow.countryISO2Code.trim(),
      swiftCode: inputRow.swiftCode.trim(),
      name: inputRow.name.trim(),
      address: inputRow.address.trim(),
    };
    bankRows.push(bankRow);
    countries.set(inputRow.countryISO2Code.trim(), inputRow.countryName.trim());
  }

  const countriesArray: { iso2: string; name: string }[] = Array.from(
    countries,
    ([iso2, name]) => ({
      iso2,
      name,
    })
  );

  return { banks: bankRows, countries: countriesArray };
}

async function clearTables() {
  await pool.query("DELETE FROM swift_codes");
  await pool.query("DELETE FROM countries_iso2");
}

async function insertCountries(countries: { iso2: string; name: string }[]) {
  const valuePlaceholders = countries
    .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
    .join(", ");

  const query = `
    INSERT INTO countries_iso2 (country_iso2, country_name)
    VALUES ${valuePlaceholders}
  `;

  await pool.query(
    query,
    countries.flatMap((country) => [country.iso2, country.name])
  );
}

async function insertBanks(banks: OutputRow[]) {
  const valuesPlaceholders = banks
    .map((_, index) => {
      const base = index * 4;
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
    })
    .join(", ");

  const values = banks.flatMap((bank) => [
    bank.countryISO2Code,
    bank.swiftCode,
    bank.name,
    bank.address,
  ]);

  const query = `
    INSERT INTO swift_codes (country_iso2, swift_code, bank_name, address)
    VALUES ${valuesPlaceholders}
  `;

  await pool.query(query, values);
}

async function importTsv(inputFileName: string = "input.tsv") {
  try {
    const input = await loadTsv(inputFileName);
    const preprocessed = await preprocess(input);

    await clearTables();

    await insertCountries(preprocessed.countries);
    await insertBanks(preprocessed.banks);
  } catch (err) {
    console.error(`Error importing TSV ${err}`);
  }
}

export const __TEST__ = {
  loadTsv,
  preprocess,
  insertCountries,
  insertBanks,
};

export { importTsv };
