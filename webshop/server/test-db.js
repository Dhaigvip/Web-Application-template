const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function test() {
    try {
        console.log("Testing DB connection...");
        const users = await prisma.adminUser.findMany();
        console.log("Admin users:", users);
        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

test();
