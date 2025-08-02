import prisma from "../../db/db";


export async function getRecetasFromDB() {
  const recetas = await prisma.recipe.findMany({
    include: {
      context: true,
    },
  });

  return recetas;
}