import { http, HttpResponse } from 'msw'

export const handlers = [
  // Tournaments API
  http.get('/api/tournaments', () => {
    return HttpResponse.json({
      success: true,
      data: {
        data: [
          {
            id: '1',
            name: 'Test Tournament',
            status: 'OPEN',
            tournamentStart: '2024-01-01T00:00:00Z',
            tournamentEnd: '2024-01-03T00:00:00Z',
            tournamentRegistrationStart: '2023-12-01T00:00:00Z',
            tournamentRegistrationEnd: '2023-12-31T00:00:00Z',
            categories: ['Open', 'U18'],
            hasTeams: false,
            createdBy: '1',
            createdAt: '2023-11-01T00:00:00Z',
            updatedAt: '2023-11-01T00:00:00Z',
            competitors: [],
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    })
  }),

  http.get('/api/tournaments/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        name: 'Test Tournament',
        status: 'OPEN',
        tournamentStart: '2024-01-01T00:00:00Z',
        tournamentEnd: '2024-01-03T00:00:00Z',
        tournamentRegistrationStart: '2023-12-01T00:00:00Z',
        tournamentRegistrationEnd: '2023-12-31T00:00:00Z',
        categories: ['Open', 'U18'],
        hasTeams: false,
        createdBy: '1',
        createdAt: '2023-11-01T00:00:00Z',
        updatedAt: '2023-11-01T00:00:00Z',
        creator: {
          id: '1',
          name: 'Test Admin',
          email: 'admin@test.com',
        },
      },
    })
  }),

  // Competitors API
  http.get('/api/tournaments/:id/competitors', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          tournamentId: params.id,
          personalNumber: 1,
          firstName: 'John',
          lastName: 'Doe',
          gender: 'MALE',
          category: 'Open',
          team: null,
          playerAcceptanceStatus: 'PENDING',
          createdAt: '2023-11-01T00:00:00Z',
          updatedAt: '2023-11-01T00:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    })
  }),

  // Auth API
  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'ADMIN',
      },
    })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === 'admin@test.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'admin@test.com',
            name: 'Test Admin',
            role: 'ADMIN',
          },
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
          },
        },
      })
    }
    return HttpResponse.json(
      {
        success: false,
        error: 'Invalid credentials',
      },
      { status: 401 }
    )
  }),

  // Error handlers
  http.get('*', () => {
    return HttpResponse.json(
      {
        success: false,
        error: 'Not found',
      },
      { status: 404 }
    )
  }),
]
