const express = require("express");
const router = express.Router();
const backupController = require("../controller/backup.controller");

router.post("/backup", backupController.createBackup);

module.exports = router;
