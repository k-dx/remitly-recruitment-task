import { pool } from "../db.js";
import { logger } from "../logger.js";
import { QueryResult } from "pg";
import { RequestHandler } from "express";
import { MessageResponse, CountryISO2CodeParams } from "@types_/types.js";

type BankResponse = {
  countryISO2: string;
  countryName: string;
  swiftCodes: {
    address: string;
    bankName: string;
    countryISO2: string;
    isHeadquarter: boolean;
    swiftCode: string;
  }[];
};

export const getBanksByCountryISO2: RequestHandler<
  CountryISO2CodeParams,
  BankResponse | MessageResponse
> = async (req, res, next) => {
  try {
    const countryISO2 = req.params.countryISO2code;

    const countryQuery =
      "SELECT country_iso2, country_name FROM countries_iso2 WHERE country_iso2 = $1";
    const countryValues = [countryISO2];

    const countryResult: QueryResult<{
      country_iso2: string;
      country_name: string;
    }> = await pool.query(countryQuery, countryValues);

    if (countryResult.rowCount === 0) {
      return res.status(404).json({ message: "Country not found" });
    }

    const swiftCodesQuery =
      "SELECT address, bank_name, country_iso2, swift_code FROM swift_codes WHERE country_iso2 = $1";
    const swiftCodesValues = [countryISO2];

    const swiftCodesResult: QueryResult<{
      address: string;
      bank_name: string;
      country_iso2: string;
      swift_code: string;
    }> = await pool.query(swiftCodesQuery, swiftCodesValues);

    const response = {
      countryISO2: countryResult.rows[0].country_iso2,
      countryName: countryResult.rows[0].country_name,
      swiftCodes: swiftCodesResult.rows.map((row) => ({
        address: row.address,
        bankName: row.bank_name,
        countryISO2: row.country_iso2,
        isHeadquarter: row.swift_code.endsWith("XXX"),
        swiftCode: row.swift_code,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ err: error, req }, "Error fetching swift codes");
    return res.status(500).json({ message: "Internal server error" });
  }
};
