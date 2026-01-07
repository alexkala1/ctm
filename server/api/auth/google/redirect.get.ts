import { googleOAuth } from '../../../utils/google-oauth';

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters with error handling
    let redirectTo = '/';
    try {
      // Use the URL from the event to parse query parameters
      const url = new URL(event.node.req.url || '', `http://${event.node.req.headers.host || 'localhost'}`);
      redirectTo = url.searchParams.get('redirectTo') || '/';
    } catch (urlError) {
      console.warn('Failed to parse query parameters, using default:', urlError);
      // redirectTo remains '/' as default
    }

    // Check if Google OAuth credentials are configured
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID === 'dummy-client-id' ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      process.env.GOOGLE_CLIENT_SECRET === 'dummy-client-secret'
    ) {
      // For development/testing, redirect to a demo page instead of throwing error
      console.log('Google OAuth credentials not configured, redirecting to demo page');
      return sendRedirect(event, `/auth/demo-oauth?redirectTo=${encodeURIComponent(redirectTo)}`, 302);
    }

    // Generate Google OAuth URL
    const authUrl = googleOAuth.getAuthUrl();

    // Store redirect URL in session or state parameter
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64');
    const urlWithState = `${authUrl}&state=${state}`;

    // Redirect to Google OAuth
    return sendRedirect(event, urlWithState, 302);
  } catch (error) {
    console.error('Google OAuth redirect error:', error);

    // If it's already a createError, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // For any other errors, redirect to demo page with safe default
    return sendRedirect(event, '/auth/demo-oauth', 302);
  }
});

