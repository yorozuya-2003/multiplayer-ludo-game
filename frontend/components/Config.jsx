// loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const API_URL = process.env.BACKEND_API_URL;

export default API_URL;