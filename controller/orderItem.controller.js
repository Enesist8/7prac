const db = require('../db');

class OrderItemController {
    async createOrderItem(req, res) {
        const { order_id, inventory_id, quantity, price_at_purchase } = req.body;
        try {
            const client = await db.connect();
            const result = await client.query(
                'INSERT INTO order_items (order_id, inventory_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4) RETURNING *',
                [order_id, inventory_id, quantity, price_at_purchase]
            );
            client.release();
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error creating order item:', error);
            res.status(500).json({ error: 'Failed to create order item' });
        }
    }

    async getOrderItems(req, res) {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM order_items');
            client.release();
            res.json(result.rows);
        } catch (error) {
            console.error('Error getting order items:', error);
            res.status(500).json({ error: 'Failed to retrieve order items' });
        }
    }

    async getOneOrderItem(req, res) {
        const id = req.params.id;
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM order_items WHERE order_item_id = $1', [id]);
            client.release();
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Order item not found' });
            }
        } catch (error) {
            console.error('Error getting order item:', error);
            res.status(500).json({ error: 'Failed to retrieve order item' });
        }
    }

    async updateOrderItem(req, res) {
        const id = req.params.id;
        const { order_id, inventory_id, quantity, price_at_purchase } = req.body;
        try {
            const client = await db.connect();
            const result = await client.query(
                'UPDATE order_items SET order_id = $1, inventory_id = $2, quantity = $3, price_at_purchase = $4 WHERE order_item_id = $5 RETURNING *',
                [order_id, inventory_id, quantity, price_at_purchase, id]
            );
            client.release();
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Order item not found' });
            }
        } catch (error) {
            console.error('Error updating order item:', error);
            res.status(500).json({ error: 'Failed to update order item' });
        }
    }

    async deleteOrderItem(req, res) {
        const id = req.params.id;
        try {
            const client = await db.connect();
            const result = await client.query('DELETE FROM order_items WHERE order_item_id = $1', [id]);
            client.release();
            if (result.rowCount > 0) {
                res.json({ message: 'Order item deleted successfully' });
            } else {
                res.status(404).json({ error: 'Order item not found' });
            }
        } catch (error) {
            console.error('Error deleting order item:', error);
            res.status(500).json({ error: 'Failed to delete order item' });
        }
    }
}

module.exports = new OrderItemController();