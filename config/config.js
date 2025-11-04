require('dotenv').config(); 

// SSL configuration helper
const getSSLConfig = () => {
  return process.env.POSTGRES_SSL ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Set to true in production if you have valid certificates
      },
    },
  } : {};
};

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'mydatabase',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    dialect: 'postgres',
    ...getSSLConfig(),
  },
  test: {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB_TEST || 'mydatabase_test',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    dialect: 'postgres',
    ...getSSLConfig(),
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: 'postgres',
    ...getSSLConfig(),
  },
};