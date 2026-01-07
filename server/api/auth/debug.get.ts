export default defineEventHandler(async (event) => {
  return {
    adminEmails: process.env.ADMIN_EMAILS || 'not set',
    nodeEnv: process.env.NODE_ENV,
    authOrigin: process.env.AUTH_ORIGIN,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'not set',
  };
});
