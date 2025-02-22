// prisma/seed.ts
import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create Users
  const password = await bcrypt.hash('password123', 10);
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: password,
        emailVerified: faker.date.past(),
        image: faker.image.avatar(),
        profile: {
          create: {
            bio: faker.lorem.sentence(),
            avatarUrl: faker.image.avatar(),
          },
        },
      },
    });
    users.push(user);
  }

  // Create Projects
  const projects = [];
  for (let i = 0; i < 3; i++) {
    const project = await prisma.project.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        createdBy: { connect: { id: users[i]!.id } },
        members: { connect: users.map((user) => ({ id: user.id })) }, // All users are members
      },
    });
    projects.push(project);
  }

  // Create Tags
  const tags = [];
  for (let i = 0; i < 6; i++) {
    const tag = await prisma.tag.create({
      data: {
        name: faker.lorem.word(),
        project: { connect: { id: projects[i % 3]!.id } },
      },
    });
    tags.push(tag);
  }

  // Create Tasks
  for (let i = 0; i < 10; i++) {
    await prisma.task.create({
      data: {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.enumValue(TaskStatus),
        priority: faker.helpers.enumValue(TaskPriority),
        deadline: faker.date.future(),
        createdBy: { connect: { id: users[i % 5]!.id } },
        assignedTo: { connect: [{ id: users[(i + 1) % 5]!.id }, {id: users[(i+2)%5]!.id}] }, // Assign 2 users
        project: { connect: { id: projects[i % 3]!.id } },
        tags: { connect: [{ id: tags[i % 6]!.id }, { id: tags[(i+1) % 6]!.id }] }, //Assign 2 tags
        comments: {
          create: {
            content: faker.lorem.sentence(),
            user: { connect: { id: users[i % 5]!.id } },
          },
        },
        files: {
          create: {
            name: faker.system.fileName(),
            url: faker.internet.url(),
          },
        },
        imageUrls: [faker.image.url(), faker.image.url()]
      },
    });
  }

  console.log('✅ Database seeded!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });