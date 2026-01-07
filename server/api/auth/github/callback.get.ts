import { githubOAuth } from '../../../utils/github-oauth';
import prisma from '../../../../lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    let code = '';
    let state = '';
    try {
      // Use the URL from the event to parse query parameters
      const url = new URL(event.node.req.url || '', `http://${event.node.req.headers.host || 'localhost'}`);
      code = url.searchParams.get('code') || '';
      state = url.searchParams.get('state') || '';
    } catch (urlError) {
      console.warn('Failed to parse query parameters:', urlError);
      return sendRedirect(event, '/auth/login?error=invalid_request', 302);
    }

    if (!code) {
      console.error('No authorization code received');
      return sendRedirect(event, '/auth/login?error=no_code', 302);
    }

    // Decode the state parameter to get redirect URL
    let redirectTo = '/';
    try {
      if (state) {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        redirectTo = decodedState.redirectTo || '/';
      }
    } catch (stateError) {
      console.warn('Failed to decode state parameter:', stateError);
      // Continue with default redirect
    }

    // Exchange authorization code for access token
    const accessToken = await githubOAuth.getAccessToken(code);

    // Get user info from GitHub
    const userInfo = await githubOAuth.getUserInfo(accessToken);

    // Persist and fetch user from database (source of truth)
    const dbUser = await prisma.user.upsert({
      where: { email: userInfo.email },
      create: {
        email: userInfo.email,
        name: userInfo.name || userInfo.email,
        avatarUrl: userInfo.picture || undefined,
        provider: 'GITHUB',
        providerId: userInfo.id,
        status: 'APPROVED',
        lastLoginAt: new Date(),
      },
      update: {
        name: userInfo.name || undefined,
        avatarUrl: userInfo.picture || undefined,
        provider: 'GITHUB',
        providerId: userInfo.id,
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        provider: true,
      }
    });

    // Create a session token (in a real app, you'd use a proper JWT or session store)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      provider: dbUser.provider,
      role: dbUser.role,
      status: dbUser.status,
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

    console.log('GitHub OAuth successful for user:', userInfo.email);
    
    return sendRedirect(event, redirectTo, 302);
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return sendRedirect(event, '/auth/login?error=oauth_failed', 302);
  }
});
