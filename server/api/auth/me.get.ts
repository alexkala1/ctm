export default defineEventHandler(async event => {
  try {
    // Get the auth token from cookies
    const authToken = getCookie(event, 'auth-token');

    if (!authToken) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    try {
      // Decode the session token
      const sessionData = JSON.parse(Buffer.from(authToken, 'base64').toString());

      // Check if token is expired (7 days)
      const tokenAge = Date.now() - sessionData.timestamp;
      const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds

      if (tokenAge > maxAge) {
        // Token expired, clear it
        setCookie(event, 'auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0,
          path: '/',
        });

        return {
          success: false,
          message: 'Authentication token expired',
        };
      }

      // Look up the latest user record in the database
      const prisma = (await import('../../../lib/prisma')).default;
      const dbUser = await prisma.user.findUnique({
        where: { id: sessionData.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          provider: true,
        },
      });

      if (!dbUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Return user data from DB (source of truth)
      return {
        success: true,
        data: {
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || dbUser.email,
            role: dbUser.role,
            status: dbUser.status,
            provider: dbUser.provider,
          },
        },
      };
    } catch (decodeError) {
      console.error('Failed to decode auth token:', decodeError);
      return {
        success: false,
        message: 'Invalid authentication token',
      };
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      success: false,
      message: 'Authentication check failed',
    };
  }
});
