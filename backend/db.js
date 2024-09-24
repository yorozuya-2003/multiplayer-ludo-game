// loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const Pool = require("pg").Pool;

// database configuration
const postgresUrl = process.env.POSTGRES_URL;
const connectionString = `${postgresUrl}`;

const pool = new Pool({
  connectionString,
  keepAlive: true,
});

module.exports = pool;
