const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller"); // Adjust path if needed

router.post("/auth", authController.login);

module.exports = router;
