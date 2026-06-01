const express = require('express');
const winston = require('winston');

const PORT = process.env.PORT || 8080;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const DD_SERVICE = process.env.DD_SERVICE || 'exemple-app-cnp';
const DD_ENV = process.env.DD_ENV || 'development';
const DD_VERSION = process.env.DD_VERSION || '1.0.0';

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.json(),
  defaultMeta: {
    service: DD_SERVICE,
    env: DD_ENV,
    version: DD_VERSION,
  },
  transports: [new winston.transports.Console()],
});

const app = express();

// Structured request logging
app.use((req, res, next) => {
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from exemple-app-cnp', version: DD_VERSION });
});

module.exports = app;

//  Only start the server when run directly (not when imported by tests)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info('server started', { port: PORT });
  });

  // Graceful shutdown for Kubernetes rolling updates
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('server closed');
      process.exit(0);
    });
  });
}
