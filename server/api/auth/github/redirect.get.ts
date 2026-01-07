import { githubOAuth } from '../../../utils/github-oauth';

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

    if (!process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID === 'dummy-client-id') {
      return sendRedirect(event, `/auth/demo-oauth?redirectTo=${encodeURIComponent(redirectTo)}`, 302);
    }

    const authUrl = githubOAuth.getAuthUrl();
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64');
    const urlWithState = `${authUrl}&state=${state}`;
    return sendRedirect(event, urlWithState, 302);
  } catch (error) {
    console.error('GitHub OAuth redirect error:', error);
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }
    // For other errors, redirect to demo page as fallback
    return sendRedirect(event, '/auth/demo-oauth', 302);
  }
});

