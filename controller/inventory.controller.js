const db = require("../db");

class InventoryController {
  async createInventoryItem(req, res) {
    const { instrument_id, quantity, price, condition } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "INSERT INTO inventory (instrument_id, quantity, price, condition) VALUES ($1, $2, $3, $4) RETURNING *",
        [instrument_id, quantity, price, condition],
      );
      client.release();
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  }

  async getInventoryItems(req, res) {
    try {
      const client = await db.connect();
      const result = await client.query("SELECT * FROM inventory");
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting inventory items:", error);
      res.status(500).json({ error: "Failed to retrieve inventory items" });
    }
  }

  async getOneInventoryItem(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "SELECT * FROM inventory WHERE inventory_id = $1",
        [id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Inventory item not found" });
      }
    } catch (error) {
      console.error("Error getting inventory item:", error);
      res.status(500).json({ error: "Failed to retrieve inventory item" });
    }
  }

  async updateInventoryItem(req, res) {
    const id = req.params.id;
    const { instrument_id, quantity, price, condition } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "UPDATE inventory SET instrument_id = $1, quantity = $2, price = $3, condition = $4 WHERE inventory_id = $5 RETURNING *",
        [instrument_id, quantity, price, condition, id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Inventory item not found" });
      }
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  }

  async deleteInventoryItem(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "DELETE FROM inventory WHERE inventory_id = $1",
        [id],
      );
      client.release();
      if (result.rowCount > 0) {
        res.json({ message: "Inventory item deleted successfully" });
      } else {
        res.status(404).json({ error: "Inventory item not found" });
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  }
}

module.exports = new InventoryController();
