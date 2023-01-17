import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "matt@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("iloveyou", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.todo.create({
    data: { userId: user.id, title: "Take a nap", completed: true },
  });

  await prisma.todo.create({
    data: { userId: user.id, title: "Stretch", completed: true },
  });

  await prisma.todo.create({
    data: { userId: user.id, title: "Laundry", completed: false },
  });

  await prisma.todo.create({
    data: { userId: user.id, title: "Setup Database", completed: true },
  });
  await prisma.todo.create({
    data: { userId: user.id, title: "Give talk", completed: true },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
