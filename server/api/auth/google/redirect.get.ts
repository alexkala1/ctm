import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3'
import { googleOAuth } from '../../../utils/google-oauth'

export default defineEventHandler(async (event) => {
  try {
    // Check if Google OAuth credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'dummy-client-id') {
      // For development/testing, redirect to a demo page instead of throwing error
      const query = getQuery(event)
      const { redirectTo = '/' } = query
      
      // Redirect to a demo page showing OAuth setup instructions
      await sendRedirect(event, `/auth/demo-oauth?redirectTo=${encodeURIComponent(redirectTo as string)}`)
    }

    const query = getQuery(event)
    const { redirectTo = '/' } = query
    
    // Generate Google OAuth URL
    const authUrl = googleOAuth.getAuthUrl()
    
    // Store redirect URL in session or state parameter
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64')
    const urlWithState = `${authUrl}&state=${state}`
    
    // Redirect to Google OAuth
    await sendRedirect(event, urlWithState)
  } catch (error) {
    console.error('Google OAuth redirect error:', error)
    
    // If it's already a createError, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to initiate Google OAuth'
    })
  }
})
