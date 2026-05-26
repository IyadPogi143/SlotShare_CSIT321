import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, './.env') });

async function setupDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'slotshare_db';

  console.log(`Connecting to MySQL at ${host} as ${user}...`);
  
  try {
    // Connect without specifying the database first
    const connection = await mysql.createConnection({
      host,
      user,
      password
    });

    console.log('✅ Connected to MySQL server successfully!');
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database "${dbName}" checked/created successfully!`);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error during database setup:', error.message);
    console.error('Ensure that MySQL is running and that your root user has the correct credentials.');
    return false;
  }
}

setupDatabase();
