import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, './.env') });

async function alterDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'slotshare_db';

  console.log(`Connecting to MySQL database "${dbName}"...`);
  
  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database: dbName
    });

    console.log('✅ Connected successfully!');

    // 1. Modify the role enum to include 'driver' and 'owner'
    console.log('Altering "users" table to support role ENUM("admin", "driver", "owner")...');
    await connection.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('admin', 'driver', 'owner') NOT NULL DEFAULT 'driver'
    `);
    console.log('✅ Table modified successfully!');

    // 2. Set any empty or incorrect roles to 'driver'
    console.log('Updating any users with empty or invalid roles...');
    const [result] = await connection.query(`
      UPDATE users 
      SET role = 'driver' 
      WHERE role = '' OR role IS NULL
    `);
    console.log(`✅ Updated ${result.affectedRows} user(s) to 'driver'!`);

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error during database alteration:', error.message);
    return false;
  }
}

alterDatabase();
