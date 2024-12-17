const express = require("express");
const router = express.Router();
const instrumentTypeController = require("../controller/instrumentType.controller");

router.post("/instrumentTypes", instrumentTypeController.createInstrumentType);
router.get("/instrumentTypes", instrumentTypeController.getInstrumentTypes);
router.get(
  "/instrumentTypes/:id",
  instrumentTypeController.getOneInstrumentType,
);
router.put(
  "/instrumentTypes/:id",
  instrumentTypeController.updateInstrumentType,
);
router.delete(
  "/instrumentTypes/:id",
  instrumentTypeController.deleteInstrumentType,
);

module.exports = router;
