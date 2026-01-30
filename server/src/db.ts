import { Pool } from "pg";
import fs from "fs"

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  
  ssl: {
    ca: fs.readFileSync("certs/global-bundle.pem").toString()
  }
});
