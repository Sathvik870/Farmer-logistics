// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const os = require('os');
const cookieParser = require('cookie-parser');
const logger = require('./src/logger');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  `http://${findLocalIp()}:5173`,
  'https://farmer-logistics.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  const localIp = findLocalIp();
  logger.info(`Server running and accessible on:`);
  logger.info(`  - Local:   http://localhost:${PORT}`);
  if (localIp) {
    logger.info(`  - Network: http://${localIp}:${PORT}`);
  }
});

function findLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const { address, family, internal } = iface;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
  return null;
}