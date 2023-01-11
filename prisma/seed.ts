import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const personData: Prisma.PersonCreateInput[] = [
  {
    name: 'A N S E L',
    walletId: 'CZgpbGa7Cj1znLGH1xf2jGpDn8Dy72dap7UmhSVKPPiE',
    games: {
      create: [
        {
          gameItems: {
            create: {

            }
          }
        },
      ],
    },
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of personData) {
    const person = await prisma.person.create({
      data: u,
    })
    console.log(`Created person with id: ${person.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })