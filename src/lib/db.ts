import { Pool } from "pg";
import dotenv from "dotenv";
import fs from 'fs/promises';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in .env.local");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => {throw ('Connected to database')})
  .catch((err) => {throw new Error('Error connecting to database: ' + err)});
