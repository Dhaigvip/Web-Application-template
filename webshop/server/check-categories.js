const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
    // Find videogames category
    const videogamesCat = await prisma.category.findUnique({
        where: { path: "electronics/videogames" }
    });

    if (!videogamesCat) {
        console.log("videogames category not found");
        await prisma.$disconnect();
        return;
    }

    console.log("Videogames category:", videogamesCat);

    // Find all products assigned to videogames
    const productCategories = await prisma.productCategory.findMany({
        where: { categoryId: videogamesCat.id },
        include: {
            product: true
        }
    });

    console.log("\nProducts in videogames category:");
    console.log(
        JSON.stringify(
            productCategories.map((pc) => ({
                id: pc.product.id,
                slug: pc.product.slug,
                name: pc.product.name,
                isActive: pc.product.isActive,
                isPrimary: pc.isPrimary
            })),
            null,
            2
        )
    );

    // Check all products
    const allProducts = await prisma.product.findMany({
        select: { id: true, slug: true, name: true, isActive: true }
    });
    console.log("\n\nAll products in database:");
    console.log(JSON.stringify(allProducts, null, 2));

    await prisma.$disconnect();
})();
