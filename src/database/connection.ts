// src/database/connection.ts

import { DataSource, DataSourceOptions } from 'typeorm';

require('dotenv').config()

const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
  synchronize: false,
  entities: [__dirname + '/../models/*.ts'] // Use __dirname to resolve path
};

export const appDataSource = new DataSource(databaseOptions);

export async function initializeDatabase() {
   console.time('db connection');
   try {
     await appDataSource.initialize();
     console.timeEnd('db connection');
   } catch (error) {
     console.error('Error initializing database:', error);
     throw error; // Re-throw the error to propagate it to the caller
   }
 }
