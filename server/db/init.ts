import fs from 'fs';
import path from 'path';
import pool from './index';

async function initDb() {
  try {
    // Read and execute migration files
    const migrationPath = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationPath)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationPath, file), 'utf-8');
      console.log(`Executing migration: ${file}`);
      await pool.query(sql);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initDb();
}

export default initDb; 