import { createError } from 'h3'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'dummy-client-id'
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'dummy-client-secret'
const AUTH_ORIGIN = process.env.AUTH_ORIGIN || 'http://localhost:3000'
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${AUTH_ORIGIN}/api/auth/github/callback`

export const githubOAuth = {
  getAuthUrl(): string {
    const base = 'https://github.com/login/oauth/authorize'
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'read:user user:email',
      allow_signup: 'true',
    })
    return `${base}?${params.toString()}`
  },

  async getTokens(code: string): Promise<{ access_token: string }>{
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    if (!resp.ok) {
      throw createError({ statusCode: 400, statusMessage: 'Failed to get GitHub access token' })
    }

    const data = (await resp.json()) as { access_token?: string; error?: string }
    if (!data.access_token) {
      throw createError({ statusCode: 400, statusMessage: 'No access token from GitHub' })
    }
    return { access_token: data.access_token }
  },

  async getUser(accessToken: string): Promise<{ id: string; email?: string; name?: string; avatar_url?: string }>{
    const userResp = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'ctm-app' },
    })
    if (!userResp.ok) {
      throw createError({ statusCode: 400, statusMessage: 'Failed to fetch GitHub user' })
    }
    const user = (await userResp.json()) as { id: number; name?: string; email?: string; avatar_url?: string }

    // Email may be null here; fetch emails endpoint
    let email = user.email
    if (!email) {
      const emailsResp = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'ctm-app' },
      })
      if (emailsResp.ok) {
        const emails = (await emailsResp.json()) as Array<{ email: string; primary: boolean; verified: boolean }>
        const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0]
        email = primary?.email
      }
    }

    return { id: String(user.id), email: email || undefined, name: user.name, avatar_url: user.avatar_url }
  },
}

export default githubOAuth

