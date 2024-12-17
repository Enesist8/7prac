const db = require('../db');

class InstrumentController {
    async createInstrument(req, res) {
        const { name, brand_id, type_id, description, image_url } = req.body;
        console.log('Received data:', { name, brand_id, type_id, description, image_url }); //Log the received data
        try {
            const client = await db.connect();
            const result = await client.query(
                'INSERT INTO instruments (name, brand_id, type_id, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, brand_id, type_id, description, image_url]
            );
            client.release();
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error creating instrument:', error);
            res.status(500).json({ error: 'Failed to create instrument' });
        }
    }

    async getInstruments(req, res) {
        try {
            const client = await db.connect();
            console.log('Before query'); // Add this line
            const result = await client.query(`
                SELECT
                    i.*,
                    b.name AS brand_name,
                    t.name AS type_name
                FROM instruments i
                         JOIN brands b ON i.brand_id = b.brand_id  -- Corrected join condition
                         JOIN instrument_types t ON i.type_id = t.type_id  -- Corrected join condition
            `);
            console.log('After query', result.rows); // Add this line
            client.release();
            res.json(result.rows);
        } catch (error) {
            console.error('Error getting instruments:', error); //Log the error here
            res.status(500).json({ error: 'Failed to retrieve instruments' });
        }
    }

    async getOneInstrument(req, res) {
        const id = req.params.id;
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM instruments WHERE instrument_id = $1', [id]);
            client.release();
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Instrument not found' });
            }
        } catch (error) {
            console.error('Error getting instrument:', error);
            res.status(500).json({ error: 'Failed to retrieve instrument' });
        }
    }

    async updateInstrument(req, res) {
        const id = req.params.id;
        const { name, brand_id, type_id, description, image_url } = req.body;
        try {
            const client = await db.connect();
            const result = await client.query(
                'UPDATE instruments SET name = $1, brand_id = $2, type_id = $3, description = $4, image_url = $5 WHERE instrument_id = $6 RETURNING *',
                [name, brand_id, type_id, description, image_url, id]
            );
            client.release();
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Instrument not found' });
            }
        } catch (error) {
            console.error('Error updating instrument:', error);
            res.status(500).json({ error: 'Failed to update instrument' });
        }
    }

    async deleteInstrument(req, res) {
        const id = req.params.id;
        try {
            const client = await db.connect();
            const result = await client.query('DELETE FROM instruments WHERE instrument_id = $1', [id]);
            client.release();
            if (result.rowCount > 0) {
                res.json({ message: 'Instrument deleted successfully' });
            } else {
                res.status(404).json({ error: 'Instrument not found' });
            }
        } catch (error) {
            console.error('Error deleting instrument:', error);
            res.status(500).json({ error: 'Failed to delete instrument' });
        }
    }
}

module.exports = new InstrumentController();