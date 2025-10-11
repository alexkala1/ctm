import { OAuth2Client } from 'google-auth-library'

// Google OAuth configuration
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
  process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
  process.env.GOOGLE_REDIRECT_URI || `${process.env.AUTH_ORIGIN || 'http://localhost:3000'}/api/auth/google/callback`
)

export const googleOAuth = {
  client,
  
  // Generate Google OAuth URL
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
    
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  },
  
  // Verify Google OAuth token and get user info
  async verifyToken(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      
      const payload = ticket.getPayload()
      if (!payload) {
        throw new Error('Invalid token payload')
      }
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        verified: payload.email_verified
      }
    } catch (error) {
      console.error('Google OAuth token verification failed:', error)
      throw new Error('Invalid Google token')
    }
  },
  
  // Exchange authorization code for tokens
  async getTokens(code: string) {
    try {
      const { tokens } = await client.getToken(code)
      return tokens
    } catch (error) {
      console.error('Google OAuth: Failed to exchange code for tokens:', error)
      throw new Error('Failed to get Google tokens')
    }
  }
}

export default googleOAuth
