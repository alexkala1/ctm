import { PrismaClient, UserRole, UserStatus, AuthProvider } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users
  const users = await Promise.all([
    // Super Admin
    prisma.user.upsert({
      where: { email: 'superadmin@chess-tournament.com' },
      update: {},
      create: {
        email: 'superadmin@chess-tournament.com',
        name: 'Super Admin',
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.APPROVED,
        provider: AuthProvider.EMAIL,
        approvedAt: new Date(),
        lastLoginAt: new Date(),
      },
    }),

    // Admin
    prisma.user.upsert({
      where: { email: 'admin@chess-tournament.com' },
      update: {},
      create: {
        email: 'admin@chess-tournament.com',
        name: 'Tournament Admin',
        role: UserRole.ADMIN,
        status: UserStatus.APPROVED,
        provider: AuthProvider.EMAIL,
        approvedAt: new Date(),
        lastLoginAt: new Date(),
      },
    }),

    // Regular User
    prisma.user.upsert({
      where: { email: 'user@chess-tournament.com' },
      update: {},
      create: {
        email: 'user@chess-tournament.com',
        name: 'Regular User',
        role: UserRole.USER,
        status: UserStatus.APPROVED,
        provider: AuthProvider.EMAIL,
        approvedAt: new Date(),
        lastLoginAt: new Date(),
      },
    }),

    // Pending User
    prisma.user.upsert({
      where: { email: 'pending@chess-tournament.com' },
      update: {},
      create: {
        email: 'pending@chess-tournament.com',
        name: 'Pending User',
        role: UserRole.USER,
        status: UserStatus.PENDING,
        provider: AuthProvider.GOOGLE,
        providerId: 'google_123456789',
        avatarUrl: 'https://via.placeholder.com/150',
      },
    }),

    // OAuth Users
    prisma.user.upsert({
      where: { email: 'google.user@example.com' },
      update: {},
      create: {
        email: 'google.user@example.com',
        name: 'Google User',
        role: UserRole.USER,
        status: UserStatus.APPROVED,
        provider: AuthProvider.GOOGLE,
        providerId: 'google_987654321',
        avatarUrl: 'https://via.placeholder.com/150',
        approvedAt: new Date(),
        lastLoginAt: new Date(),
      },
    }),

    prisma.user.upsert({
      where: { email: 'github.user@example.com' },
      update: {},
      create: {
        email: 'github.user@example.com',
        name: 'GitHub User',
        role: UserRole.USER,
        status: UserStatus.PENDING,
        provider: AuthProvider.GITHUB,
        providerId: 'github_456789123',
        avatarUrl: 'https://via.placeholder.com/150',
      },
    }),

  ])

  console.log(`✅ Created ${users.length} users`)
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
