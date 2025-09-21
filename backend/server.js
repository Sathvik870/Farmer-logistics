const app = require('./app');
const logger = require('./src/logger');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});