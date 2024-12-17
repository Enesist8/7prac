const db = require('../db');


module.exports = {
    async createNewCart(req, res) {
        const sessionId = req.session.id;
        try {
            const client = await db.connect();
            await client.query(
                'INSERT INTO user_carts (session_id, cart) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET cart = $2',
                [sessionId, JSON.stringify({})]
            );
            client.release();
            res.status(201).json({ message: 'Cart created successfully' });
        } catch (error) {
            console.error('Error creating cart:', error);
            res.status(500).json({ error: 'Failed to create cart', details: error.message });
        }
    },
    async getUserCart(req, res) {
        const userId = req.session.userId; // Assuming you store user ID in the session

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' }); // User not logged in
        }

        try {
            const client = await db.connect();
            const result = await client.query(
                'SELECT * FROM cart WHERE user_id = $1', //Change the query based on your cart table
                [userId]
            );
            client.release();
            res.json(result.rows);
        } catch (error) {
            console.error('Error getting user cart:', error);
            res.status(500).json({ error: 'Failed to retrieve user cart' });
        }
    },

    async addToCart(req, res) {
        const sessionId = req.session.id;
        const { instrumentId, quantity } = req.body;

        if (!sessionId || !instrumentId || !quantity || quantity <= 0 || isNaN(parseInt(quantity, 10))) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        try {
            const client = await db.connect();
            const result = await client.query('SELECT cart FROM user_carts WHERE session_id = $1', [sessionId]);
            const cart = result.rows[0] ? JSON.parse(result.rows[0].cart) : {};
            cart[instrumentId] = (cart[instrumentId] || 0) + parseInt(quantity, 10);
            await client.query(
                'INSERT INTO user_carts (session_id, cart) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET cart = $2',
                [sessionId, JSON.stringify(cart)]
            );
            client.release();
            res.json({ message: 'Item added', cart });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Failed to add to cart', details: error.message });
        }
    },

    async getCart(req, res) {
        const sessionId = req.session.id;
        try {
            const client = await db.connect();
            const result = await client.query('SELECT cart FROM user_carts WHERE session_id = $1', [sessionId]);
            const cart = result.rows[0] ? JSON.parse(result.rows[0].cart) : {};
            client.release();
            res.json(cart);
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ error: 'Failed to retrieve cart', details: error.message });
        }
    },

    async updateCartItem(req, res) {
        const sessionId = req.session.id;
        const { instrumentId } = req.params;
        const { quantity } = req.body;

        try {
            const client = await db.connect();
            const result = await client.query('SELECT cart FROM user_carts WHERE session_id = $1', [sessionId]);
            const cart = result.rows[0] ? JSON.parse(result.rows[0].cart) : {};
            if (!cart[instrumentId]) {
                return res.status(404).json({ error: 'Item not found in cart' });
            }
            cart[instrumentId] = parseInt(quantity, 10); // Update quantity
            await client.query(
                'INSERT INTO user_carts (session_id, cart) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET cart = $2',
                [sessionId, JSON.stringify(cart)]
            );
            client.release();
            res.json({ message: 'Item updated', cart });
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ error: 'Failed to update cart item', details: error.message });
        }
    },

    async deleteCartItem(req, res) {
        const sessionId = req.session.id;
        const { instrumentId } = req.params;

        try {
            const client = await db.connect();
            const result = await client.query('SELECT cart FROM user_carts WHERE session_id = $1', [sessionId]);
            const cart = result.rows[0] ? JSON.parse(result.rows[0].cart) : {};
            if (!cart[instrumentId]) {
                return res.status(404).json({ error: 'Item not found in cart' });
            }
            delete cart[instrumentId]; // Delete item
            await client.query(
                'INSERT INTO user_carts (session_id, cart) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET cart = $2',
                [sessionId, JSON.stringify(cart)]
            );
            client.release();
            res.json({ message: 'Item deleted', cart });
        } catch (error) {
            console.error('Error deleting cart item:', error);
            res.status(500).json({ error: 'Failed to delete cart item', details: error.message });
        }
    }
};