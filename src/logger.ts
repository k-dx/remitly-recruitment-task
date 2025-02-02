import pino from "pino";
import { ENV_DEVELOPMENT, ENV_PRODUCTION, ENV_TEST } from "./environment.js";

const level =
  process.env.NODE_ENV === ENV_DEVELOPMENT
    ? "debug"
    : process.env.NODE_ENV === ENV_PRODUCTION
    ? "warn"
    : process.env.NODE_ENV === ENV_TEST
    ? "silent"
    : "info";

const logger = pino.default({ level });

export { logger };
