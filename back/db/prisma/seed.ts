import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando importación directa...');

    const filePath = path.join(__dirname, 'import.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const jsonRecipes = JSON.parse(rawData);

    const recetasParaInsertar: any[] = [];
    const recetasParaRevision: any[] = [];

    for (const r of jsonRecipes) {
        // El filtro sigue siendo necesario para no meter basura sin nombre o sin pasos
        if (
            r.needs_review ||
            r.error ||
            !r.name || !r.ingredients || !r.recipe ||
            r.name.trim() === '' || r.ingredients.trim() === '' || r.recipe.trim() === ''
        ) {
            recetasParaRevision.push(r);
            continue;
        }

        recetasParaInsertar.push({
            name: r.name.trim(),
            ingredients: r.ingredients.trim(),
            recipe: r.recipe.trim(),
            notes: r.notes || null,
            robot: r.robot ?? true,
            frequency: r.frequency ? parseInt(r.frequency, 10) : null,
            season: r.season || null,
            type: r.type || null,
            proteinas: r.proteinas ? parseFloat(r.proteinas) : null,
            grasas: r.grasas ? parseFloat(r.grasas) : null,
            carbohidratos: r.carbohidratos ? parseFloat(r.carbohidratos) : null,
            calorias: r.calorias ? parseInt(r.calorias, 10) : null,
        });
    }

    if (recetasParaInsertar.length > 0) {
        // Pasamos de "skipDuplicates" olímpicamente. Va directo y limpio.
        const result = await prisma.recipe.createMany({
            data: recetasParaInsertar,
        });
        console.log(`✅ ¡Éxito! Se han insertado ${result.count} recetas.`);
    }

    if (recetasParaRevision.length > 0) {
        const reviewPath = path.join(__dirname, 'recetas_a_revision.json');
        fs.writeFileSync(reviewPath, JSON.stringify(recetasParaRevision, null, 2), 'utf-8');
        console.log(`⚠️ Quedan ${recetasParaRevision.length} en 'recetas_a_revision.json'.`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });