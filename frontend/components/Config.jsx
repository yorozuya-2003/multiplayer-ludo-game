// loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const apiDomain = process.env.API_DOMAIN;
const apiPort = process.env.API_PORT;

const API_URL = `${apiDomain}:${apiPort}`;

export default API_URL;
