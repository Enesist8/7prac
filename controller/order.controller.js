const db = require("../db");

class OrderController {
  async createOrder(req, res) {
    const { customer_id, order_date, shipping_address_id } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "INSERT INTO orders (customer_id, order_date, shipping_address_id) VALUES ($1, $2, $3) RETURNING *",
        [customer_id, order_date, shipping_address_id],
      );
      client.release();
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  async getOrders(req, res) {
    try {
      const client = await db.connect();
      const result = await client.query("SELECT * FROM orders");
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }

  async getOneOrder(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "SELECT * FROM orders WHERE order_id = $1",
        [id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).json({ error: "Failed to retrieve order" });
    }
  }

  async updateOrder(req, res) {
    const id = req.params.id;
    const { customer_id, order_date, shipping_address_id } = req.body;
    try {
      const client = await db.connect();
      const result = await client.query(
        "UPDATE orders SET customer_id = $1, order_date = $2, shipping_address_id = $3 WHERE order_id = $4 RETURNING *",
        [customer_id, order_date, shipping_address_id, id],
      );
      client.release();
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  }

  async deleteOrder(req, res) {
    const id = req.params.id;
    try {
      const client = await db.connect();
      const result = await client.query(
        "DELETE FROM orders WHERE order_id = $1",
        [id],
      );
      client.release();
      if (result.rowCount > 0) {
        res.json({ message: "Order deleted successfully" });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
}

module.exports = new OrderController();
