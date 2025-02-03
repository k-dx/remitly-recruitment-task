import { RequestHandler } from "express";
import { pool } from "../db.js";
import { logger } from "../logger.js";
import { MessageResponse } from "@types_/types.js";

export const insertSwiftCode: RequestHandler<{}, MessageResponse> = async (
  req,
  res,
  next
) => {
  try {
    const checkSwiftCodeQuery =
      "SELECT 1 FROM swift_codes WHERE swift_code = $1";
    const checkSwiftCodeValues = [req.body.swiftCode];

    const result = await pool.query(checkSwiftCodeQuery, checkSwiftCodeValues);

    if (result.rowCount && result.rowCount > 0) {
      res
        .status(409)
        .json({ message: "Bank with the given swift code already exists" });
      return;
    }

    const countryQuery =
      "INSERT INTO countries_iso2 (country_iso2, country_name) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM countries_iso2 WHERE country_iso2 = $1)";
    const countryValues = [req.body.countryISO2, req.body.countryName];

    const swiftQuery =
      "INSERT INTO swift_codes (address, bank_name, country_iso2, swift_code) VALUES ($1, $2, $3, $4)";
    const swiftValues = [
      req.body.address,
      req.body.bankName,
      req.body.countryISO2,
      req.body.swiftCode,
    ];

    await pool.query(countryQuery, countryValues);
    await pool.query(swiftQuery, swiftValues);

    res.status(201).json({ message: "Swift code inserted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error({ err: error, req }, "Error inserting swift code");
  }
  next();
};
