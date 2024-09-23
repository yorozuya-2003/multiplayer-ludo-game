// loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const Pool = require("pg").Pool;

// database configuration
const connectionString = process.env.POSTGRES_URL;

const pool = new Pool({
  connectionString
});

module.exports = pool;
