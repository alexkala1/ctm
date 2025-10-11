import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const tournaments = await prisma.tournament.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        tournamentStart: true,
        tournamentEnd: true,
        categories: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        competitors: {
          select: {
            id: true,
          },
        },
      },
    })

    if (process.env.NODE_ENV === 'development')
      console.log('Tournaments in database:')
    if (process.env.NODE_ENV === 'development')
      console.log(JSON.stringify(tournaments, null, 2))

    const count = await prisma.tournament.count()
    if (process.env.NODE_ENV === 'development')
      console.log(`\nTotal tournaments: ${count}`)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
