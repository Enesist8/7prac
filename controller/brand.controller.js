const db = require("../db"); // Assuming this is your database connection module

class BrandController {
  async createBrand(req, res) {
    const { name } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "INSERT INTO brands (name) VALUES ($1) RETURNING *",
        [name],
      );
      client.release();
      res.status(201).json(result.rows[0]); // Send the newly created brand
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ error: "Failed to create brand" });
    }
  }

  async getBrands(req, res) {
    try {
      const client = await db.connect();
      const result = await client.query("SELECT * FROM brands");
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting brands:", error);
      res.status(500).json({ error: "Failed to retrieve brands" });
    }
  }

  async getOneBrand(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "SELECT * FROM brands WHERE brand_id = $1",
        [id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      console.error("Error getting brand:", error);
      res.status(500).json({ error: "Failed to retrieve brand" });
    }
  }

  async updateBrand(req, res) {
    const id = req.params.id; // Get ID from the URL parameter (best practice)
    const { name } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "UPDATE brands SET name = $1 WHERE brand_id = $2 RETURNING *",
        [name, id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]); // Send the updated brand data
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ error: "Failed to update brand" });
    }
  }

  async deleteBrand(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "DELETE FROM brands WHERE brand_id = $1",
        [id],
      );
      client.release();
      if (result.rowCount > 0) {
        res.json({ message: "Brand deleted successfully" });
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ error: "Failed to delete brand" });
    }
  }
}

module.exports = new BrandController();
