import { pool } from "../db.js";
import { logger } from "../logger.js";
import { QueryResult } from "pg";
import { RequestHandler } from "express";
import { MessageResponse, SwiftCodeParams } from "../types/types.js";

type BankResponse = {
  address: string;
  bankName: string;
  countryISO2: string;
  countryName: string;
  isHeadquarter: boolean;
  swiftCode: string;
  branches?: {
    address: string;
    bankName: string;
    countryISO2: string;
    isHeadquarter: boolean;
    swiftCode: string;
  }[];
};

export const getBanksBySwiftCode: RequestHandler<
  SwiftCodeParams,
  BankResponse | MessageResponse
> = async (req, res, next) => {
  try {
    const swiftCode = req.params.swiftCode;

    const swiftCodeQuery = `
      SELECT 
      sc.address, 
      sc.bank_name, 
      sc.country_iso2, 
      sc.swift_code, 
      ci.country_name 
      FROM 
      swift_codes sc
      JOIN 
      countries_iso2 ci 
      ON 
      sc.country_iso2 = ci.country_iso2 
      WHERE 
      sc.swift_code = $1
    `;
    const swiftCodeValues = [swiftCode];

    const swiftCodeResult: QueryResult<{
      address: string;
      bank_name: string;
      country_iso2: string;
      country_name: string;
      swift_code: string;
    }> = await pool.query(swiftCodeQuery, swiftCodeValues);

    if (swiftCodeResult.rowCount === 0) {
      res.status(404).json({ message: "SWIFT code not found" });
      return;
    }

    const bank = swiftCodeResult.rows[0];
    const isHeadquarter = bank.swift_code.endsWith("XXX");

    if (isHeadquarter) {
      const branchesQuery = `
      SELECT 
      sc.address, 
      sc.bank_name, 
      sc.country_iso2, 
      sc.swift_code, 
      ci.country_name 
      FROM 
      swift_codes sc
      JOIN 
      countries_iso2 ci 
      ON 
      sc.country_iso2 = ci.country_iso2 
      WHERE swift_code LIKE $1`;
      const branchesValues = [bank.swift_code.slice(0, 8) + "%"];

      const branchesResult: QueryResult<{
        address: string;
        bank_name: string;
        country_iso2: string;
        country_name: string;
        swift_code: string;
      }> = await pool.query(branchesQuery, branchesValues);

      const response: BankResponse = {
        address: bank.address,
        bankName: bank.bank_name,
        countryISO2: bank.country_iso2,
        countryName: bank.country_name,
        isHeadquarter: true,
        swiftCode: bank.swift_code,
        branches: branchesResult.rows.map((row) => ({
          address: row.address,
          bankName: row.bank_name,
          countryISO2: row.country_iso2,
          isHeadquarter: row.swift_code.endsWith("XXX"),
          swiftCode: row.swift_code,
        })),
      };
      res.status(200).json(response);
    } else {
      const response = {
        address: bank.address,
        bankName: bank.bank_name,
        countryISO2: bank.country_iso2,
        countryName: bank.country_name,
        isHeadquarter: false,
        swiftCode: bank.swift_code,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error({ err: error, req }, "Error fetching swift codes");
  }
  next();
};
