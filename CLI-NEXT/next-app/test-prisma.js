const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users found:', users.length);
    } catch (e) {
        console.error('DATABASE_URL connection failure:');
        console.error(JSON.stringify(e, null, 2));
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
