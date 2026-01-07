export default defineEventHandler(async _event => {
  try {
    return {
      success: true,
      data: {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development') console.error('Fetch tournaments error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tournaments',
    });
  }
});
