import winston from 'winston';

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'chess-tournament-manager' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

export const log = {
  error: (message: string, meta?: Record<string, unknown>) => logger.error(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta),
  info: (message: string, meta?: Record<string, unknown>) => logger.info(message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta),

  // Auth-specific logging
  auth: {
    login: (email: string, success: boolean, ip?: string) => {
      logger.info('User login attempt', {
        email,
        success,
        ip,
        timestamp: new Date().toISOString(),
      });
    },

    register: (email: string, success: boolean, ip?: string) => {
      logger.info('User registration attempt', {
        email,
        success,
        ip,
        timestamp: new Date().toISOString(),
      });
    },

    logout: (userId: string, ip?: string) => {
      logger.info('User logout', {
        userId,
        ip,
        timestamp: new Date().toISOString(),
      });
    },

    failedAttempt: (email: string, reason: string, ip?: string) => {
      logger.warn('Failed authentication attempt', {
        email,
        reason,
        ip,
        timestamp: new Date().toISOString(),
      });
    },
  },
};

export default logger;
