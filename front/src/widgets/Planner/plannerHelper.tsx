import { DayPlan, Recipe, WeekPlan } from '../../domain/model.types';

export const DAYS_ES: Record<number, string> = { 0: 'Lun', 1: 'Mar', 2: 'Mié', 3: 'Jue', 4: 'Vie', 5: 'Sáb', 6: 'Dom' };

// ---------------------------------------------------------------------------
// Helpers de fecha
// ---------------------------------------------------------------------------

export function getISOWeekDates(weekOffset: number): string[] {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d.toISOString().slice(0, 10);
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

export function generateMockWeekPlan(recipes: Recipe[]): WeekPlan {
    const pool = recipes.filter(r => r.id);
    if (!pool.length) return buildEmptyWeek(0);
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    return Object.fromEntries(
        getISOWeekDates(0).map((date) => [
            date,
            {
                lunch:  { id: crypto.randomUUID(), snapshot: [{ id: pick().id, name: pick().name, imageUrl: null }] },
                dinner: { id: crypto.randomUUID(), snapshot: [{ id: pick().id, name: pick().name, imageUrl: null }] },
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