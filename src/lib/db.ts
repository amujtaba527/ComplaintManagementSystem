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
  .then(() => {alert("✅ Database connected successfully!")})
  .catch((err) => {alert("❌ Database connection failed:" + err)});

  async function runInitScript() {
    try {
      const client = await pool.connect();
      const sql = await fs.readFile('./init-db.sql', 'utf8'); 
      await client.query(sql);
      client.release();
    } catch (error) {
      alert('Database initialization failed' + error);
    } finally {
      await pool.end(); 
    }
  }
  
  runInitScript();