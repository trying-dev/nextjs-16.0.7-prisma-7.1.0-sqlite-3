import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: [
          {
            title: 'My first post',
            content: 'This is my first post on the blog',
            published: true,
          },
          {
            title: 'Draft post',
            content: 'This post is not published yet',
            published: false,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Learning Next.js',
            content: 'Next.js is great with Prisma and SQLite',
            published: true,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed!');
  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
