import { pool } from "../db.js";
import { logger } from "../logger.js";
import { QueryResult } from "pg";
import { RequestHandler } from "express";
import { MessageResponse, SwiftCodeParams } from "../types/types.js";

export const deleteSwiftCode: RequestHandler<
  SwiftCodeParams,
  MessageResponse
> = async (req, res, next) => {
  try {
    const swiftCode = req.params.swiftCode;

    const deleteSwiftCodeQuery =
      "DELETE FROM swift_codes WHERE swift_code = $1 RETURNING country_iso2";
    const deleteSwiftCodeValues = [swiftCode];

    const result: QueryResult<{ country_iso2: string }> = await pool.query(
      deleteSwiftCodeQuery,
      deleteSwiftCodeValues
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Swift code not found" });
    }

    const countryISO2 = result.rows[0].country_iso2;

    const checkCountryQuery =
      "SELECT 1 FROM swift_codes WHERE country_iso2 = $1";
    const checkCountryValues = [countryISO2];

    const countryResult = await pool.query(
      checkCountryQuery,
      checkCountryValues
    );

    if (countryResult.rowCount === 0) {
      const deleteCountryQuery =
        "DELETE FROM countries_iso2 WHERE country_iso2 = $1";
      const deleteCountryValues = [countryISO2];

      await pool.query(deleteCountryQuery, deleteCountryValues);
    }

    return res.status(200).json({ message: "Swift code deleted successfully" });
  } catch (error) {
    logger.error({ err: error, req }, "Error deleting swift code");
    return res.status(500).json({ message: "Internal server error" });
  }
};
