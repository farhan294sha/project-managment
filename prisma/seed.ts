import { PrismaClient, TaskStatus, TaskPriority } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Create users with hashed passwords
  const password = await bcrypt.hash("Password123!", 10);

  // Create 10 users
  const users = [];

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        emailVerified: faker.date.past(),
        profile: {
          create: {
            bio: faker.person.bio(),
            avatarUrl: faker.image.avatar(),
          },
        },
      },
    });
    users.push(user);
    console.log(`Created user: ${user.name}`);
  }

  console.log("Users created");

  // Create 3-5 projects
  const numProjects = faker.number.int({ min: 3, max: 5 });
  const projects = [];

  for (let i = 0; i < numProjects; i++) {
    // Randomly select creator from users
    const creatorIndex = faker.number.int({ min: 0, max: users.length - 1 });

    // Randomly select 2-8 team members
    const teamSize = faker.number.int({ min: 2, max: 8 });
    const teamMembers = faker.helpers.arrayElements(users, teamSize);

    const project = await prisma.project.create({
      data: {
        name: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        createdById: users[creatorIndex]?.id || "",
        members: {
          connect: teamMembers.map((user) => ({ id: user.id })),
        },
      },
    });
    projects.push(project);
    console.log(`Created project: ${project.name}`);
  }

  console.log("Projects created");

  // Create tags for each project
  const allTags = [];

  for (const project of projects) {
    // Generate 4-8 tags per project
    const numTags = faker.number.int({ min: 4, max: 8 });
    const projectTags = [];

    const tagOptions = [
      "frontend",
      "backend",
      "bug",
      "feature",
      "urgent",
      "documentation",
      "design",
      "testing",
      "refactor",
      "optimization",
      "security",
      "accessibility",
      "mobile",
      "desktop",
      "api",
      "database",
      "ui",
      "ux",
      "performance",
    ];

    // Select random unique tags
    const selectedTagNames = faker.helpers.arrayElements(tagOptions, numTags);

    for (const tagName of selectedTagNames) {
      const tag = await prisma.tag.create({
        data: {
          name: `${tagName}-${project.id.substring(0, 4)}`, // Make unique per project
          projectId: project.id,
        },
      });
      projectTags.push(tag);
      allTags.push({ tag, projectId: project.id });
    }

    console.log(
      `Created ${projectTags.length} tags for project: ${project.name}`
    );
  }

  console.log("Tags created");

  // Create tasks for each project
  const allTasks = [];

  for (const project of projects) {
    // Get project members and tags
    const projectMembers = await prisma.project
      .findUnique({
        where: { id: project.id },
        include: { members: true },
      })
      .then((p) => p?.members || []);

    const projectTags = allTags
      .filter((t) => t.projectId === project.id)
      .map((t) => t.tag);

    // Generate 5-15 tasks per project
    const numTasks = faker.number.int({ min: 5, max: 15 });

    for (let i = 0; i < numTasks; i++) {
      // Randomly select creator from project members
      const creatorIndex = faker.number.int({
        min: 0,
        max: projectMembers.length - 1,
      });

      // Randomly select 1-3 assignees
      const numAssignees = faker.number.int({ min: 1, max: 3 });
      const assignees = faker.helpers.arrayElements(
        projectMembers,
        numAssignees
      );

      // Randomly select 1-3 tags
      const numTaskTags = faker.number.int({ min: 1, max: 3 });
      const taskTags = faker.helpers.arrayElements(projectTags, numTaskTags);

      // Random status
      const status = faker.helpers.arrayElement(Object.values(TaskStatus));

      // Random priority
      const priority = faker.helpers.arrayElement(Object.values(TaskPriority));

      // Random deadline (between now and 30 days from now)
      const deadline = faker.date.future({ refDate: 30 });

      const task = await prisma.task.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 8 }).replace(".", ""),
          description: faker.lorem.paragraphs({ min: 1, max: 3 }),
          status,
          priority,
          deadline,
          createdById: projectMembers[creatorIndex]?.id || "",
          projectId: project.id,
          assignedTo: {
            connect: assignees.map((user) => ({ id: user.id })),
          },
          tags: {
            connect: taskTags.map((tag) => ({ id: tag.id })),
          },
        },
      });

      allTasks.push(task);
    }

    console.log(`Created ${numTasks} tasks for project: ${project.name}`);
  }

  console.log("Tasks created");

  // Create comments for tasks
  const allComments = [];

  for (const task of allTasks) {
    // Get project members
    const project = await prisma.task
      .findUnique({
        where: { id: task.id },
        include: { project: { include: { members: true } } },
      })
      .then((t) => t?.project);

    const projectMembers = project?.members || [];

    // Generate 0-5 comments per task
    const numComments = faker.number.int({ min: 0, max: 5 });
    const taskComments = [];

    for (let i = 0; i < numComments; i++) {
      // Randomly select commenter from project members
      const commenterIndex = faker.number.int({
        min: 0,
        max: projectMembers.length - 1,
      });

      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.paragraph(),
          taskId: task.id,
          userId: projectMembers[commenterIndex]?.id || "",
        },
      });

      taskComments.push(comment);
      allComments.push(comment);
    }
  }

  console.log("Comments created");

  // Create reactions for comments
  for (const comment of allComments) {
    // Determine if the comment gets reactions (70% chance)
    if (faker.number.int({ min: 1, max: 10 }) <= 7) {
      // Get project members
      const task = await prisma.comment
        .findUnique({
          where: { id: comment.id },
          include: {
            task: { include: { project: { include: { members: true } } } },
          },
        })
        .then((c) => c?.task);

      const projectMembers = task?.project?.members || [];

      // Generate 1-3 reactions per comment
      const numReactions = faker.number.int({ min: 1, max: 3 });

      // Potential emojis
      const emojis = ["👍", "👎", "❤️", "🎉", "😄", "🤔", "👀", "🚀"];

      for (let i = 0; i < numReactions; i++) {
        // Randomly select reactor from project members
        const reactorIndex = faker.number.int({
          min: 0,
          max: projectMembers.length - 1,
        });
        const emoji = faker.helpers.arrayElement(emojis);

        try {
          await prisma.reaction.create({
            data: {
              emoji,
              userId: projectMembers[reactorIndex]?.id || "",
              commentId: comment.id,
            },
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Skip if duplicate reaction (same user, same emoji, same comment)
          console.log("Skipping duplicate reaction");
        }
      }
    }
  }

  console.log("Reactions created");

  // Create files for tasks
  for (const task of allTasks) {
    // 50% chance of having files
    if (faker.number.int({ min: 1, max: 10 }) <= 5) {
      // Get task assignees
      const taskData = await prisma.task.findUnique({
        where: { id: task.id },
        include: { assignedTo: true },
      });

      const assignees = taskData?.assignedTo || [];

      // Generate 1-3 files per task
      const numFiles = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < numFiles; i++) {
        // Randomly select uploader from assignees
        const uploaderIndex = faker.number.int({
          min: 0,
          max: assignees.length - 1,
        });

        // Random file type
        const fileTypes = [
          { type: "image/png", ext: "png" },
          { type: "image/jpeg", ext: "jpg" },
          { type: "application/pdf", ext: "pdf" },
          { type: "application/msword", ext: "doc" },
          { type: "text/plain", ext: "txt" },
          { type: "application/vnd.ms-excel", ext: "xls" },
        ];

        const fileType = faker.helpers.arrayElement(fileTypes);

        await prisma.file.create({
          data: {
            url: `https://example.com/files/${faker.lorem.slug()}.${fileType.ext}`,
            type: fileType.type,
            userId: assignees[uploaderIndex]?.id || "",
            taskId: task.id,
          },
        });
      }
    }
  }

  console.log("Files created");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
