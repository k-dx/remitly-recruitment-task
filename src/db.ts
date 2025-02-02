import pg from "pg";

const pool = new pg.Pool(); // uses environment variables

export { pool };
