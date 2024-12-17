const express = require('express');
const router = express.Router();
const instrumentController = require('../controller/instrument.controller'); // Adjust path if needed


// Create a new instrument
router.post('/instruments', instrumentController.createInstrument);

// Get all instruments
router.get('/instruments', instrumentController.getInstruments);


// Get one instrument by ID
router.get('/instruments/:id', instrumentController.getOneInstrument);

// Update an instrument by ID
router.put('/instruments/:id', instrumentController.updateInstrument);

// Delete an instrument by ID
router.delete('/instruments/:id', instrumentController.deleteInstrument);
router.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const results = await pool.query(
            'SELECT * FROM search_instruments($1)',
            [searchTerm]
        );

        if(results.rows && results.rows.length > 0 && results.rows[0].error){
            return res.status(500).json({error: results.rows[0].error});
        }

        res.json(results.rows);
    } catch (error) {
        console.error('Error fetching instruments:', error);
        res.status(500).json({ error: 'Failed to fetch instruments' });
    }
});
module.exports = router;