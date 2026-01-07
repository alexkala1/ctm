export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth-token');
  
  if (!authToken) {
    return { success: false, message: 'No auth token found' };
  }

  try {
    const sessionData = JSON.parse(Buffer.from(authToken, 'base64').toString());
    return {
      success: true,
      session: sessionData
    };
  } catch (error) {
    return {
      success: false,
      message: 'Invalid token',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});
