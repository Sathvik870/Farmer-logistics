const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

exports.signup = async (req, res) => {
  const { first_name, last_name,username, password, email, phone_number, role } = req.body;

  if (!first_name || !last_name  || !username || !password || !email || !phone_number || !role) {
    logger.warn(`[AUTH] Signup failed: Missing required fields.`);
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  if (role !== 'admin' && role !== 'superadmin') {
      return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    const userExists = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userExists.rows.length > 0) {
      logger.warn(`[AUTH] Signup failed: Username or email already exists for ${username}`);
      return res.status(409).json({ message: 'Username or email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserQuery = `
      INSERT INTO users (first_name, last_name,username, password, email, phone_number, role) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING  id, first_name, last_name, username, email, role, created_at, authorized;
    `;
    const { rows } = await db.query(newUserQuery, [first_name, last_name, username, hashedPassword, email, phone_number, role]);
    
    logger.info(`[AUTH] New user created: ${username}. Awaiting admin authorization.`);
    res.status(201).json({
      message: 'User registered successfully. Your account requires admin authorization before you can log in.',
      user: rows[0],
    });

  } catch (error) {
    logger.error(`[AUTH] Server error during signup for user ${username}: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn(`[AUTH] Login failed: Missing username or password.`);
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (rows.length === 0) {
      logger.warn(`[AUTH] Login failed: User not found for username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials or user not authorized.' });
    }

    const user = rows[0];
    if (!user.authorized) {
      logger.warn(`[AUTH] Login failed: User '${username}' is not authorized to log in.`);
      return res.status(403).json({ message: 'Account not authorized. Please contact an administrator.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`[AUTH] Login failed: Invalid password for username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials or user not authorized.' });
    }
    const tokenPayload = { userId: user.id, username: user.username, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '5d' });
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });
    
    logger.info(`[AUTH] Login successful for user: ${username}`);

    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
    });

  } catch (error) {
    logger.error(`[AUTH] Server error during login for user ${username}: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
    res.cookie('authToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    logger.info(`[AUTH] User logged out successfully.`);
    res.status(200).json({ message: 'Logged out successfully' });
};