const { backupDatabase } = require('../utils/backup');
const { dbConfig } = require('../db');
const path = require('path');

const BACKUPS_FOLDER = path.join(__dirname, '../backups');

const backupController = {
    createBackup: async (req, res) => {
        try {
            const backupFile = await backupDatabase(dbConfig, BACKUPS_FOLDER)
            return res.status(200).json({ message: 'Database backup created successfully.', backupFile: backupFile });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Failed to create database backup.', error: error.message });
        }
    },
};

module.exports = backupController;