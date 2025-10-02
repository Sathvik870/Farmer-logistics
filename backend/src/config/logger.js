const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDir = 'logs';
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }),

    new winston.transports.DailyRotateFile({
        level: 'info',
        filename: path.join(logDir, '%DATE%-success.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '5d'
    }),
    
    new winston.transports.DailyRotateFile({
        level: 'error',
        filename: path.join(logDir, '%DATE%-error.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '5d'  
    })
];

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: transports,
    exitOnError: false
});

logger.info("Logger initialized. It will now log to console and daily-rotated files.");

module.exports = logger;