const db = require('../db');
const bcrypt = require('bcrypt'); // Import bcrypt
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET; // Get JWT secret from environment variables

if (!jwtSecret) {
    console.error('JWT_SECRET environment variable not set!');
    process.exit(1); // Exit if secret isn't set
}

class UserController {
    async createUser(req, res) {
        const { name, surname, login, password, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            const client = await db.connect();
            const result = await client.query(
                'INSERT INTO person (name, surname, login, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, surname, login, hashedPassword, role]
            );
            client.release();
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.code === '23505') { //Unique constraint violation
                res.status(409).json({ error: 'Login already exists' });
            } else {
                res.status(500).json({ error: 'Failed to create user' });
            }
        }
    }

    async getUsers(req, res) {
            const client = await db.connect();
            const users = await client.query('SELECT * FROM person');
            res.json(users.rows);

    }

    async getOneUser(req, res) {
        const id = req.params.id;
        const users = await db.query('SELECT * FROM person WHERE id = $1', [id]);
        res.json(users.rows[0]);
    }

    async updateUser(req, res) {
        const { id, name, surname, login, password, role } = req.body;
        try {
            // Input validation (add more robust checks as needed)
            if (!id || !name || !surname || !login || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password here

            const client = await db.connect();
            const result = await client.query(
                'UPDATE person SET name = $1, surname = $2, login = $3, password = $4, role = $5 WHERE id = $6 RETURNING *',
                [name, surname, login, hashedPassword, role, id] // Use hashedPassword
            );
            client.release();

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating user:', error); // Log the error for debugging

            // More specific error handling based on error type (example)
            if (error.code === '23505') { // Unique constraint violation (duplicate login)
                return res.status(409).json({ error: 'Login already exists' });
            } else if (error.code === '22P02') { //Invalid data type
                return res.status(400).json({ error: 'Invalid data type' });
            }
            // Add more specific error handling as needed...

            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        const users = await db.query('DELETE FROM person WHERE id = $1', [id]);
        res.json(users.rows[0]);
    }

    async login(req, res) {
        const { login, password } = req.body;
        try {
            const client = await db.connect();
            const result = await client.query(
                'SELECT id, name, surname, password FROM person WHERE login = $1',
                [login]
            );
            client.release();

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid login or password' });
            }

            const token = jwt.sign({ userId: user.id }, jwtSecret);
            res.json({ token, user: {id: user.id, name: user.name, surname: user.surname, login: user.login} });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }



}

module.exports = new UserController();