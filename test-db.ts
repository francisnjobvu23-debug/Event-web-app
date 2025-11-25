import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    await client.connect();
    console.log("✅ Connected to Neon DB!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.end();
  }
}

test();
