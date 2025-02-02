import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { validatePostPayload } from "./middleware/validatePostPayload.js";
import { insertSwiftCode } from "./middleware/insertSwiftCode.js";
import { deleteSwiftCode } from "./middleware/deleteSwiftCode.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Dockerized TypeScript API!");
});

app.post("/v1/swift-codes", validatePostPayload, insertSwiftCode);

app.delete("/v1/swift-codes/:swiftCode", deleteSwiftCode);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };
