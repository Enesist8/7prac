const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventory.controller"); // Adjust path if needed

router.post("/inventory", inventoryController.createInventoryItem);
router.get("/inventory", inventoryController.getInventoryItems);
router.get("/inventory/:id", inventoryController.getOneInventoryItem);
router.put("/inventory/:id", inventoryController.updateInventoryItem);
router.delete("/inventory/:id", inventoryController.deleteInventoryItem);

module.exports = router;
