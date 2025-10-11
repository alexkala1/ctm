export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tournamentId = query.tournamentId

  if (!tournamentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tournament ID is required',
    })
  }

  return {
    success: true,
    message: `Test endpoint for tournament ${tournamentId}`,
    data: [],
  }
})
