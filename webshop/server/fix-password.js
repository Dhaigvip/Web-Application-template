const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function fixPassword() {
    try {
        const hashedPassword = await bcrypt.hash("admin", 10);
        console.log("Hashed password:", hashedPassword);

        await prisma.adminUser.update({
            where: { email: "admin@example.com" },
            data: { password: hashedPassword }
        });

        console.log("Password updated successfully!");
        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

fixPassword();
