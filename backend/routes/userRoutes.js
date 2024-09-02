const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

router.post("/", controller.create_user);

module.exports = router;
