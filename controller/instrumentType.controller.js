const db = require("../db");

class InstrumentTypeController {
  async createInstrumentType(req, res) {
    const { name } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "INSERT INTO instrument_types (name) VALUES ($1) RETURNING *",
        [name],
      );
      client.release();
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating instrument type:", error);
      res.status(500).json({ error: "Failed to create instrument type" });
    }
  }

  async getInstrumentTypes(req, res) {
    try {
      const client = await db.connect();
      const result = await client.query("SELECT * FROM instrument_types");
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting instrument types:", error);
      res.status(500).json({ error: "Failed to retrieve instrument types" });
    }
  }

  async getOneInstrumentType(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "SELECT * FROM instrument_types WHERE type_id = $1",
        [id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Instrument type not found" });
      }
    } catch (error) {
      console.error("Error getting instrument type:", error);
      res.status(500).json({ error: "Failed to retrieve instrument type" });
    }
  }

  async updateInstrumentType(req, res) {
    const instrumentTypeId = req.params.id; // Get ID from URL parameter
    const { name } = req.body;

    try {
      const client = await db.connect();
      const result = await client.query(
        "UPDATE instrument_types SET name = $1 WHERE type_id = $2 RETURNING *",
        [name, instrumentTypeId],
      );
      client.release();

      if (result.rowCount === 0) {
        //Check if any rows were affected
        return res.status(404).json({ error: "Instrument type not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating instrument type:", error);
      return res
        .status(500)
        .json({ error: "Failed to update instrument type" });
    }
  }

  async deleteInstrumentType(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "DELETE FROM instrument_types WHERE type_id = $1",
        [id],
      );
      client.release();
      if (result.rowCount > 0) {
        res.json({ message: "Instrument type deleted successfully" });
      } else {
        res.status(404).json({ error: "Instrument type not found" });
      }
    } catch (error) {
      console.error("Error deleting instrument type:", error);
      res.status(500).json({ error: "Failed to delete instrument type" });
    }
  }
}

module.exports = new InstrumentTypeController();
