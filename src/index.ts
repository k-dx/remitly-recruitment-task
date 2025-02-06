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

const router = express.Router();

router.get(`/:${swiftCode}`, getBanksBySwiftCode);

router.get(`/country/:${countryISO2code}`, getBanksByCountryISO2);

router.post("/", validatePostPayload, insertSwiftCode);

router.delete(`/:${swiftCode}`, deleteSwiftCode);

app.use("/v1/swift-codes", router);

app.use((req: Request, res: Response<MessageResponse>) => {
  return res.status(404).json({ message: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };
