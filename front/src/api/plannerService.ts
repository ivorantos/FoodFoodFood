import type { MealType } from '../domain/model.types';

export async function assignRecipeToSlot(
    recipeId: string,
    date: string,
    mealType: MealType,
): Promise<void> {
    // TODO: descomentar cuando exista el endpoint
    // const res = await fetch('http://localhost:3000/api/planner/assign', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ recipeId, date, mealType }),
    // });
    // if (!res.ok) throw new Error('Error al asignar receta al planner');

    console.log('[plannerService] assign (mock)', { recipeId, date, mealType });
    await Promise.resolve();
}

export function invalidatePlannerCache(): void {
    window.dispatchEvent(new CustomEvent('planner:invalidate'));
}