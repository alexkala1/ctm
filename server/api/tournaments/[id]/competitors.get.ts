export default defineEventHandler(async (event) => {
  const tournamentId = getRouterParam(event, 'id')

  return {
    success: true,
    message: `Test endpoint for tournament ${tournamentId}`,
    data: [],
  }
})
