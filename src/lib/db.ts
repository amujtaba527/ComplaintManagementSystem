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
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

  async function runInitScript() {
    try {
      const client = await pool.connect();
      const sql = await fs.readFile('./init-db.sql', 'utf8'); 
      await client.query(sql);
      console.log('Database initialized successfully!');
      client.release();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      await pool.end(); 
    }
  }
  
  runInitScript();