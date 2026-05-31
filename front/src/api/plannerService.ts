import type { MealType } from '../domain/model.types';

const BASE = 'http://localhost:3000/api/planner';

export async function getWeekPlan(weekStart: string) {
    const res = await fetch(`${BASE}/${weekStart}`);
    if (!res.ok) throw new Error('Error fetching week plan');
    const json = await res.json();
    return json.data;
}

export async function upsertSlot(
    weekStart: string,
    date: string,
    mealType: MealType,
    entries: { recipeId: string; recipeName: string; order: number }[]
) {
    const res = await fetch(`${BASE}/slot`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStart, date, mealType, entries }),
    });
    if (!res.ok) throw new Error('Error saving slot');
}

export async function clearSlot(weekStart: string, date: string, mealType: MealType) {
    const res = await fetch(`${BASE}/slot/clear`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStart, date, mealType }),
    });
    if (!res.ok) throw new Error('Error clearing slot');
}

export function invalidatePlannerCache(): void {
    window.dispatchEvent(new CustomEvent('planner:invalidate'));
}