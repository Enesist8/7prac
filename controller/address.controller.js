const db = require('../db');

class AddressController {
    async createAddress(req, res) {
        const { customer_id, street, city, state, zip_code } = req.body;
        try {
            const client = await db.connect();
            const result = await client.query(
                'INSERT INTO addresses (customer_id, street, city, state, zip_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [customer_id, street, city, state, zip_code]
            );
            client.release();
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error creating address:', error);
            res.status(500).json({ error: 'Failed to create address' });
        }
    }

    async getAddresses(req, res) {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM addresses');
            client.release();
            res.json(result.rows);
        } catch (error) {
            console.error('Error getting addresses:', error);
            res.status(500).json({ error: 'Failed to retrieve addresses' });
        }
    }

    async getOneAddress(req, res) {
        const id = req.params.id;
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM addresses WHERE address_id = $1', [id]);
            client.release();
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Address not found' });
            }
        } catch (error) {
            console.error('Error getting address:', error);
            res.status(500).json({ error: 'Failed to retrieve address' });
        }
    }

    async updateAddress(req, res) {
        const id = req.params.id;
        const { customer_id, street, city, state, zip_code } = req.body;
        try {
            const client = await db.connect();
            const result = await client.query(
                'UPDATE addresses SET customer_id = $1, street = $2, city = $3, state = $4, zip_code = $5 WHERE address_id = $6 RETURNING *',
                [customer_id, street, city, state, zip_code, id]
            );
            client.release();
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Address not found' });
            }
        } catch (error) {
            console.error('Error updating address:', error);
            res.status(500).json({ error: 'Failed to update address' });
        }
    }

    async deleteAddress(req, res) {
        const id = req.params.id;
        try {
            const client = await db.connect();
            const result = await client.query('DELETE FROM addresses WHERE address_id = $1', [id]);
            client.release();
            if (result.rowCount > 0) {
                res.json({ message: 'Address deleted successfully' });
            } else {
                res.status(404).json({ error: 'Address not found' });
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            res.status(500).json({ error: 'Failed to delete address' });
        }
    }
}

module.exports = new AddressController();