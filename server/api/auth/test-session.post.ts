export default defineEventHandler(async (event) => {
  try {
    // Create a test session for debugging
    const testUser = {
      id: 'test-user-123',
      email: 'admin@example.com', // Change this to your admin email
      name: 'Test Admin',
      provider: 'google',
      role: 'SUPER_ADMIN',
      status: 'APPROVED',
    };

    // Create a session token
    const sessionToken = Buffer.from(JSON.stringify({
      userId: testUser.id,
      email: testUser.email,
      name: testUser.name,
      provider: testUser.provider,
      role: testUser.role,
      status: testUser.status,
      timestamp: Date.now()
    })).toString('base64');

    // Set authentication cookie
    setCookie(event, 'auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return {
      success: true,
      message: 'Test session created',
      user: testUser
    };
  } catch (error) {
    console.error('Test session error:', error);
    return {
      success: false,
      message: 'Test session failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});
