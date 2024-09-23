// loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const apiHost = process.env.API_DOMAIN;
const apiPort = process.env.API_PORT;

const API_URL = `${apiHost}:${apiPort}`;

export default API_URL;
