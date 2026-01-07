// GitHub OAuth configuration - using native fetch instead of OAuth2Client

export const githubOAuth = {
  // Generate GitHub OAuth URL
  getAuthUrl(): string {
    const scopes = ['user:email'];
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const redirectUri = `${process.env.AUTH_ORIGIN || 'http://localhost:3000'}/api/auth/github/callback`;

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || 'dummy-client-id',
      scope: scopes.join(' '),
      response_type: 'code',
      redirect_uri: redirectUri,
    });

    return `${baseUrl}?${params.toString()}`;
  },

  // Exchange authorization code for access token
  async getAccessToken(code: string) {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('GitHub OAuth: Failed to exchange code for token:', error);
      throw new Error('Failed to get GitHub token');
    }
  },

  // Get user info from GitHub
  async getUserInfo(accessToken: string) {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Chess-Tournament-Manager',
        },
      });

      const user = await response.json();

      // Get email separately if not public
      let email = user.email;
      if (!email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Chess-Tournament-Manager',
          },
        });
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary && e.verified);
        email = primaryEmail?.email;
      }

      return {
        id: user.id.toString(),
        email,
        name: user.name || user.login,
        picture: user.avatar_url,
        verified: !!email,
      };
    } catch (error) {
      console.error('GitHub OAuth: Failed to get user info:', error);
      throw new Error('Failed to get GitHub user info');
    }
  },
};

export default githubOAuth;
