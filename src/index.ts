import express, { RequestHandler } from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { validatePostPayload } from "./middleware/validatePostPayload.js";
// import { Pool } from "pg";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Dockerized TypeScript API!");
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

app.post(
  "/v1/swift-codes",
  validatePostPayload,
  (req: Request, res: Response) => {
    res.send();
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
