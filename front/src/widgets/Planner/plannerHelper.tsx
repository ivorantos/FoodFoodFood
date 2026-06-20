import {DayPlan, MealType, Recipe, RecipeSnapshot, WeekPlan} from '../../domain/model.types';

export const DAYS_ES: Record<number, string> = { 0: 'Lun', 1: 'Mar', 2: 'Mié', 3: 'Jue', 4: 'Vie', 5: 'Sáb', 6: 'Dom' };

// ---------------------------------------------------------------------------
// Helpers de fecha
// ---------------------------------------------------------------------------

export function getISOWeekDates(weekOffset: number): string[] {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7);
    monday.setHours(12, 0, 0, 0); // ← evita desfase UTC en zonas +N
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    });
}

export function buildEmptyWeek(weekOffset: number): WeekPlan {
    return Object.fromEntries(
        getISOWeekDates(weekOffset).map((date) => [
            date,
            {
                lunch:  { id: crypto.randomUUID(), snapshot: null },
                dinner: { id: crypto.randomUUID(), snapshot: null },
            } satisfies DayPlan,
        ])
    );
}


// ---------------------------------------------------------------------------
// Cálculos de macros
// ---------------------------------------------------------------------------

export function getDayTotals(day: DayPlan, recipes: Recipe[]) {
    const snapshotIds = [
        ...(day.lunch.snapshot  ?? []).map(s => s.id),
        ...(day.dinner.snapshot ?? []).map(s => s.id),
    ];
    return snapshotIds.reduce(
        (acc, id) => {
            const r = recipes.find(r => r.id === id);
            if (!r) return acc;
            return {
                calorias:      acc.calorias      + (r.calorias      ?? 0),
                proteinas:     acc.proteinas     + (r.proteinas     ?? 0),
                carbohidratos: acc.carbohidratos + (r.carbohidratos ?? 0),
                grasas:        acc.grasas        + (r.grasas        ?? 0),
            };
        },
        { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
}

export function getWeekTotals(weekPlan: WeekPlan, recipes: Recipe[]) {
    return Object.values(weekPlan).reduce(
        (acc, day) => {
            const t = getDayTotals(day, recipes);
            return {
                calorias:      acc.calorias      + t.calorias,
                proteinas:     acc.proteinas     + t.proteinas,
                carbohidratos: acc.carbohidratos + t.carbohidratos,
                grasas:        acc.grasas        + t.grasas,
            };
        },
        { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
}

export function apiResponseToWeekPlan(apiPlan: any, weekOffset: number): WeekPlan {
    const base = buildEmptyWeek(weekOffset);
    if (!apiPlan?.slots) return base;


    for (const slot of apiPlan.slots) {
        if (!base[slot.date]) continue;
        base[slot.date][slot.mealType as MealType] = {
            id: slot.id,
            snapshot: slot.entries.length > 0
                ? slot.entries.map((e: any) => ({
                    id:       e.isCustom ? e.id : e.recipeId,
                    name:     e.recipeName,
                    imageUrl: null,
                    isCustom: e.isCustom ?? false,
                }))
                : null,
        };
    }
    return base;
}

export function getWeekStartFromOffset(weekOffset: number): string {
    return getISOWeekDates(weekOffset)[0]; // lunes de esa semana
}

export function snapshotToEntries(snapshot: RecipeSnapshot[] | null) {
    return (snapshot ?? []).map((s, i) => ({
        recipeId:   s.isCustom ? null : s.id,
        recipeName: s.name,
        isCustom:   s.isCustom ?? false,
        order:      i,
    }));
}