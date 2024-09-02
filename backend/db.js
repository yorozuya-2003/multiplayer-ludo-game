// loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const Pool = require("pg").Pool;

// database configuration
const postgresUser = process.env.POSTGRES_USER;
const postgresPassword = process.env.POSTGRES_PASSWORD;
const postgresDb = process.env.POSTGRES_DB;
const postgresPort = 5432;
const postgresHost = "localhost";

// const dbConnectionString = `postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDb}`;

const pool = new Pool({
  user: postgresUser,
  password: postgresPassword,
  host: postgresHost,
  port: postgresPort,
  database: postgresDb,
});

module.exports = pool;
