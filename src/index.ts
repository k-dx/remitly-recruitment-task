import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { validatePostPayload } from "./middleware/validatePostPayload.js";
import { insertSwiftCode } from "./middleware/insertSwiftCode.js";
import { deleteSwiftCode } from "./middleware/deleteSwiftCode.js";
import { getBanksByCountryISO2 } from "./middleware/getBanksByCountryISO2.js";
import { getBanksBySwiftCode } from "./middleware/getBanksBySwiftCode.js";
import { countryISO2code, MessageResponse, swiftCode } from "./types/types.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get(`/v1/swift-codes/:${swiftCode}`, getBanksBySwiftCode);

app.get(`/v1/swift-codes/country/:${countryISO2code}`, getBanksByCountryISO2);

app.post("/v1/swift-codes", validatePostPayload, insertSwiftCode);

app.delete(`/v1/swift-codes/:${swiftCode}`, deleteSwiftCode);

app.use((req: Request, res: Response<MessageResponse>) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };
