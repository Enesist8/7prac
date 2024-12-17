const express= require('express');
const session = require('express-session');
require('dotenv').config(); // Добавлено в начало index.js
const cors = require('cors');
const userRouter = require('./routes/user.routes')
const brandRouter = require('./routes/brand.routes')
const insttypeRouter = require('./routes/instrumentType.routes')
const instrumentRouter = require('./routes/instrument.routes')
const addressesRouter = require('./routes/address.routes')
const orderRouter = require('./routes/order.routes')
const inventoryRouter = require('./routes/inventory.routes')
const orderitemRouter = require('./routes/orderItem.routes')
const authRouter = require('./routes/auth.routes'); // Импорт нового маршрутизатора
const cartRouter = require('./routes/cart.router');
const backRouter = require('./routes/backup.routes');
const backupController = require('./controller/backup.controller'); // Adjust the path if needed


const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || '192.168.0.16';

const app = express()

app.use(cors());
app.use(session({
    secret: '19a488f2d1d9cf972222450f3037a47f79726622dc1bcfbcab9b26ab00d944da', // **REPLACE WITH A STRONG RANDOM SECRET**
    resave: false,
    saveUninitialized: true,
}));

app.use(express.json())
app.use(express.static('public'));
app.use('/api', userRouter)
app.use('/api', brandRouter)
app.use('/api', insttypeRouter)
app.use('/api', instrumentRouter)
app.use('/api', addressesRouter)
app.use('/api', orderRouter)
app.use('/api', inventoryRouter)
app.use('/api', orderitemRouter)
app.use('/api', authRouter)
app.use('/api/cart', cartRouter)
app.post('/api/backup', backupController.createBackup);
app.get('/api/orderinfo/:orderId', async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const result = await pool.query('SELECT * FROM get_order_info($1)', [orderId]);
        if (result.rows.length === 0) {
            return res.status(404).json([]); // Order not found
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching order info:', error);
        res.status(500).json({ error: 'Failed to fetch order info' });
    }
});

app.listen(PORT,  (HOST,) => {
    console.log(`Server started on port ${PORT} at ${HOST}`);
})