export default defineEventHandler(async _event => {
  return {
    success: true,
    message: 'Test routes endpoint working',
    availableRoutes: ['/api/tournaments', '/api/tournaments/[id]', '/api/tournaments/[id]/competitors'],
  };
});
