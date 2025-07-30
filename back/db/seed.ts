import { PrismaClient, Context } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, './recetas.json');
  const recetasRaw = fs.readFileSync(filePath, 'utf-8');
  const recetas = JSON.parse(recetasRaw);

  // Limpiar base de datos
  await prisma.recipeContext.deleteMany();
  await prisma.recipe.deleteMany();

  for (const r of recetas) {
    const receta = await prisma.recipe.create({
      data: {
        name: r.name,
        type: r.type,
        ingredients: r.ingredients,
        recipe: r.recipe,
        notes: r.notes || null,
        season: r.season || null,
        robot: r.robot,
        frequency: r.frequency ?? null,
        proteinas: r.proteinas ?? null,
        grasas: r.grasas ?? null,
        carbohidratos: r.carbohidratos ?? null,
        calorias: r.calorias ?? null,
        context: {
          connect: [], // ← esto es la clave
        },
      },
    });

    // // 💡 Aquí insertamos los contextos asociados
    // if (Array.isArray(r.context)) {
    //   for (const c of r.context) {
    //     if (c === 'comida' || c === 'cena') {
    //       await prisma.recipeContext.create({
    //         data: {
    //           context: c as Context,
    //           recipeId: receta.id,
    //         },
    //       });
    //     } else {
    //       console.warn(`❌ Contexto inválido en receta "${r.name}":`, c);
    //     }
    //   }
    // }
  }

  console.log('✅ Recetas insertadas con contextos (SQLite OK)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
