import { RequestHandler } from "express";

export const validatePostPayload: RequestHandler = (req, res, next) => {
  const {
    address,
    bankName,
    countryISO2,
    countryName,
    isHeadquarter,
    swiftCode,
  } = req.body;

  if (
    address === undefined ||
    bankName === undefined ||
    bankName === "" ||
    countryISO2 === undefined ||
    countryISO2 === "" ||
    countryName === undefined ||
    countryName === "" ||
    isHeadquarter === undefined ||
    isHeadquarter === "" ||
    swiftCode === undefined ||
    swiftCode === ""
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (countryISO2.length != 2) {
    return res
      .status(400)
      .json({ error: "Country ISO2 code must be 2 characters" });
  }

  if (swiftCode.length != 11) {
    return res.status(400).json({ error: "Swift code must be 11 characters" });
  }

  if (typeof req.body.isHeadquarter !== "boolean") {
    return res.status(400).json({ error: "isHeadquarter must be a boolean" });
  }

  const fieldsToTransform = [
    "address",
    "bankName",
    "countryISO2",
    "countryName",
    "swiftCode",
  ];
  fieldsToTransform.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.body[field] = req.body[field].toString().toUpperCase();
    }
  });

  req.body.isHeadquarter = Boolean(req.body.isHeadquarter);

  next();
};
