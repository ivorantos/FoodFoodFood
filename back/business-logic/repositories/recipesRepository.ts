import prisma from "../../db/db";


export async function getRecetasFromDB() {
  const recetas = await prisma.recipe.findMany({
    include: {
      context: true,
    },
  });

  return recetas;
}

export async function createRecetaInDB(data: any) {
  return prisma.recipe.create({ data });
}

export async function updateRecetaInDB(id: string, data: any) {
  return prisma.recipe.update({ where: { id }, data });
}

export async function deleteRecetaFromDB(id: string) {
  await prisma.recipeContext.deleteMany({ where: { recipeId: id } });
  return prisma.recipe.delete({ where: { id } });
}