const db = require('../config/db');
const logger = require('../config/logger');

exports.getUserProfile = async (req, res) => {
    const userId = req.user.userId;
    logger.info(`[USER] Attempting to fetch profile for user ID: ${userId}`);
    try {
        const { rows } = await db.query('SELECT id, username, email, phone_number, role, authorized , first_name, last_name FROM users WHERE id = $1', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        logger.error(`[USER] Error fetching profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};