import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'slotshare_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    return false;
  }
};

// Execute query
export const query = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Initialize database with schema
export const initializeDatabase = async () => {
  const connected = await testConnection();
  if (!connected) {
    console.log('⚠️  Database not available, continuing without database...');
    return false;
  }

  try {
    // Read and execute schema
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      console.log('📋 Executing database schema...');
      
      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await pool.execute(statement);
          } catch (err) {
            // Ignore errors for duplicate tables/keys
            if (err.code !== 'ER_DUP_ENTRY' && 
                err.code !== 'ER_TABLE_EXISTS_ERROR' && 
                err.code !== 'ER_DUP_KEYNAME' &&
                err.code !== 'ER_DUP_FIELDNAME') {
              console.warn(`⚠️  Schema warning: ${err.message}`);
            }
          }
        }
      }
      
      console.log('✅ Database schema initialized successfully');
      
// Create default users if not exists
       await createDefaultUsers();
      
      return true;
    } else {
      console.warn('⚠️  Schema file not found at:', schemaPath);
      return true;
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return false;
  }
};

// Create default users (admin + demo)
const createDefaultUsers = async () => {
  try {
    const bcrypt = (await import('bcryptjs')).default;

    // --- Admin user ---
    const adminEmail = 'admin@slotshare.com';
    const adminPassword = 'admin123';
    const expectedHash = '$2a$10$YourHashedPasswordHere';

    const existingAdmin = await query('SELECT id, password_hash FROM users WHERE email = ?', [adminEmail]);
    const freshAdminHash = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin.length === 0) {
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, status)
         VALUES (?, ?, ?, ?, 'admin', 'active')`,
        [adminEmail, freshAdminHash, 'Admin', 'User']
      );
      console.log('✅ Default admin user created (email: admin@slotshare.com, password: admin123)');
    } else {
      const currentHash = existingAdmin[0].password_hash;
      const isPlaceholder = currentHash === expectedHash;
      const isInvalid = !(await bcrypt.compare(adminPassword, currentHash));

      if (isPlaceholder || isInvalid) {
        await query(
          'UPDATE users SET password_hash = ? WHERE id = ?',
          [freshAdminHash, existingAdmin[0].id]
        );
        console.log('✅ Default admin password reset to "admin123"');
      }
    }

    // --- Demo user (shown on login page) ---
    const demoEmail = 'user@slotshare.com';
    const demoPassword = 'password';

    const existingDemo = await query('SELECT id FROM users WHERE email = ?', [demoEmail]);
    const freshDemoHash = await bcrypt.hash(demoPassword, 10);

    if (existingDemo.length === 0) {
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, status)
         VALUES (?, ?, ?, ?, 'user', 'active')`,
        [demoEmail, freshDemoHash, 'Demo', 'User']
      );
      console.log('✅ Default demo user created (email: user@slotshare.com, password: password)');
    }
  } catch (error) {
    console.warn('⚠️  Could not create default users:', error.message);
  }
};

export default pool;