/**
 * Application configuration with environment variable validation
 */

export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/chess_tournament_manager',
    directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // OAuth Providers
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    rateLimitMaxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5'),
  },

  // Application
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
  },
};

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Warn about insecure defaults in production
  if (config.app.nodeEnv === 'production') {
    if (config.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
      console.warn('WARNING: Using default JWT secret in production!');
    }

    if (config.database.url.includes('localhost')) {
      console.warn('WARNING: Using localhost database in production!');
    }
  }
}

// Validate configuration on startup
validateConfig();
