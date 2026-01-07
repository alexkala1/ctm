import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'development') console.log('🌱 Starting database seeding...');

  // Create super admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@chess-tournament.com' },
    update: {},
    create: {
      email: 'admin@chess-tournament.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'APPROVED',
      provider: 'EMAIL',
      approvedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });

  // Create regular admin user
  const admin = await prisma.user.upsert({
    where: { email: 'tournament@chess-tournament.com' },
    update: {},
    create: {
      email: 'tournament@chess-tournament.com',
      name: 'Tournament Admin',
      role: 'ADMIN',
      status: 'APPROVED',
      provider: 'EMAIL',
      approvedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });

  // Create a regular user account for you
  const _regularUser = await prisma.user.upsert({
    where: { email: 'user@chess-tournament.com' },
    update: {},
    create: {
      email: 'user@chess-tournament.com',
      name: 'Regular User',
      role: 'USER',
      status: 'APPROVED',
      provider: 'EMAIL',
      approvedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });

  // Create some OAuth users for testing
  const _googleUser = await prisma.user.upsert({
    where: { email: 'google.user@example.com' },
    update: {},
    create: {
      email: 'google.user@example.com',
      name: 'Google User',
      role: 'USER',
      status: 'APPROVED',
      provider: 'GOOGLE',
      providerId: 'google_123456789',
      avatarUrl: 'https://via.placeholder.com/150',
      approvedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });

  const _pendingUser = await prisma.user.upsert({
    where: { email: 'pending@chess-tournament.com' },
    update: {},
    create: {
      email: 'pending@chess-tournament.com',
      name: 'Pending User',
      role: 'USER',
      status: 'PENDING',
      provider: 'GITHUB',
      providerId: 'github_987654321',
      avatarUrl: 'https://via.placeholder.com/150',
    },
  });

  if (process.env.NODE_ENV === 'development') console.log('✅ Created admin users and regular user');

  // Create tournaments
  const tournaments = [];
  const categories = ['Open', 'Women', 'Juniors', 'Seniors', 'Rapid', 'Blitz'];
  const teams = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon'];

  for (let i = 0; i < 5; i++) {
    const tournamentStart = faker.date.future();
    const tournamentEnd = new Date(tournamentStart.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days later
    const registrationStart = faker.date.past();
    const registrationEnd = new Date(tournamentStart.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before tournament

    const tournament = await prisma.tournament.create({
      data: {
        name: faker.company.name() + ' Chess Tournament',
        status: faker.helpers.arrayElement(['DRAFT', 'OPEN', 'IN_PROGRESS', 'FINISHED']),
        tournamentStart,
        tournamentEnd,
        tournamentRegistrationStart: registrationStart,
        tournamentRegistrationEnd: registrationEnd,
        proclamations: faker.internet.url(),
        chessResults: faker.internet.url(),
        categories: faker.helpers.arrayElements(categories, { min: 2, max: 4 }),
        hasTeams: faker.datatype.boolean(),
        createdBy: faker.helpers.arrayElement([superAdmin.id, admin.id]),
      },
    });

    tournaments.push(tournament);
  }

  if (process.env.NODE_ENV === 'development') console.log('✅ Created tournaments');

  // Create competitors for each tournament
  for (const tournament of tournaments) {
    const competitorCount = faker.number.int({ min: 20, max: 100 });

    for (let i = 0; i < competitorCount; i++) {
      const gender = faker.helpers.arrayElement(['MALE', 'FEMALE']);
      const category = faker.helpers.arrayElement(tournament.categories);
      const status = faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED']);

      await prisma.competitor.create({
        data: {
          tournamentId: tournament.id,
          personalNumber: i + 1,
          firstName: faker.person.firstName(gender === 'MALE' ? 'male' : 'female'),
          lastName: faker.person.lastName(),
          ratedPlayerLinks: faker.helpers.arrayElements(
            [
              'https://ratings.fide.com/profile/12345',
              'https://www.chess.com/member/player123',
              'https://lichess.org/@/player123',
            ],
            { min: 0, max: 2 }
          ),
          gender,
          category,
          team: tournament.hasTeams ? faker.helpers.arrayElement(teams) : null,
          tournamentDocumentUrl: faker.internet.url(),
          playerAcceptanceStatus: status,
          adminNotes: status === 'REJECTED' ? faker.lorem.sentence() : null,
        },
      });
    }

    if (process.env.NODE_ENV === 'development')
      console.log(`✅ Created ${competitorCount} competitors for tournament: ${tournament.name}`);
  }

  // Note: Audit logs will be created automatically when using the application
  if (process.env.NODE_ENV === 'development') console.log('✅ Skipping audit logs (will be created during app usage)');

  if (process.env.NODE_ENV === 'development') console.log('🎉 Database seeding completed!');
  if (process.env.NODE_ENV === 'development') console.log('\n📊 Summary:');
  if (process.env.NODE_ENV === 'development') console.log(`- Users: 3 (1 Super Admin, 1 Admin, 1 Regular User)`);
  if (process.env.NODE_ENV === 'development') console.log(`- Tournaments: ${tournaments.length}`);
  if (process.env.NODE_ENV === 'development') console.log(`- Total Competitors: ${await prisma.competitor.count()}`);
  if (process.env.NODE_ENV === 'development') console.log(`- Audit Logs: ${await prisma.auditLog.count()}`);
  if (process.env.NODE_ENV === 'development') console.log('\n🔑 Login Credentials:');
  if (process.env.NODE_ENV === 'development') console.log('Super Admin: admin@chess-tournament.com');
  if (process.env.NODE_ENV === 'development') console.log('Admin: tournament@chess-tournament.com');
  if (process.env.NODE_ENV === 'development') console.log('Regular User: user@chess-tournament.com');
}

main()
  .catch(e => {
    if (process.env.NODE_ENV === 'development') console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
