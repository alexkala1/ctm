import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3'
import { githubOAuth } from '../../../utils/github-oauth'

export default defineEventHandler(async (event) => {
  try {
    if (!process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID === 'dummy-client-id') {
      const query = getQuery(event)
      const { redirectTo = '/' } = query
      await sendRedirect(event, `/auth/demo-oauth?redirectTo=${encodeURIComponent(redirectTo as string)}`)
    }

    const query = getQuery(event)
    const { redirectTo = '/' } = query

    const authUrl = githubOAuth.getAuthUrl()
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64')
    const urlWithState = `${authUrl}&state=${state}`
    await sendRedirect(event, urlWithState)
  } catch (error) {
    console.error('GitHub OAuth redirect error:', error)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to initiate GitHub OAuth' })
  }
})

