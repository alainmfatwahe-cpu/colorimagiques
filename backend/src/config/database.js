// backend/src/config/database.js
// Supporte MySQL, PostgreSQL (production) ET SQLite (dev/sandbox preview)
import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST;

const useMySQL = dbHost && dbHost !== 'sqlite';
const usePostgres = dbUrl && dbUrl.startsWith('postgresql://');

const config = usePostgres
  ? {
      client: 'pg',
      connection: dbUrl,
      pool: { min: 2, max: 10 },
      migrations: { tableName: 'knex_migrations' },
    }
  : useMySQL
  ? {
      client: 'mysql2',
      connection: {
        host: dbHost || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'colorimagiques',
        password: process.env.DB_PASSWORD || 'colorimagiques_secret',
        database: process.env.DB_NAME || 'colorimagiques',
        charset: 'utf8mb4',
      },
      pool: { min: 2, max: 10 },
    }
  : {
      client: 'better-sqlite3',
      connection: {
        filename: process.env.SQLITE_PATH || './data/colorimagiques.sqlite',
      },
      useNullAsDefault: true,
    };

const db = knex(config);

export default db;