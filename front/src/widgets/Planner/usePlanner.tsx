import { useState, useCallback, useMemo, useEffect } from 'react';
import type {MealType, Recipe, RecipeSnapshot, SelectedSlot, WeekPlan} from '../../domain/model.types';
import {
    apiResponseToWeekPlan,
    buildEmptyWeek,
    getDayTotals,
    getWeekStartFromOffset,
    getWeekTotals, snapshotToEntries,
} from './plannerHelper';
import { getRecetas } from '../../api/recipeService';
import {
    getWeekPlan,
    upsertSlot,
    clearSlot as clearSlotAPI,
} from '../../api/plannerService';

interface MoveSource {
    date:        string;
    mealType:    MealType;
    indexes:     number[];
}

interface PlannerState {
    weekOffset:   number;
    weekPlan:     WeekPlan;
    selectedSlot: SelectedSlot | null;
    moveSource:   MoveSource | null;
    selectedDay:  string;
    isDirty:      boolean;
}

export function usePlanner() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        getRecetas().then(setRecipes).catch(() => {});
        const refetch = () => getRecetas().then(setRecipes).catch(() => {});
        window.addEventListener('planner:invalidate', refetch);
        return () => window.removeEventListener('planner:invalidate', refetch);
    }, []);

    const [state, setState] = useState<PlannerState>(() => {
        const weekPlan = buildEmptyWeek(0);
        return {
            weekOffset:   0,
            weekPlan,
            selectedSlot: null,
            moveSource:   null,
            selectedDay:  Object.keys(weekPlan)[0],
            isDirty:      false,
        };
    });

    // Carga el plan de la semana actual al montar
    useEffect(() => {
        const weekStart = getWeekStartFromOffset(0);
        getWeekPlan(weekStart)
            .then(apiPlan => {
                if (!apiPlan) return;
                const weekPlan = apiResponseToWeekPlan(apiPlan, 0);
                setState(prev => ({ ...prev, weekPlan, selectedDay: Object.keys(weekPlan)[0] }));
            })
            .catch(() => {});
    }, []);

    const assignRecipe = useCallback((date: string, mealType: MealType, selected: RecipeSnapshot[]) => {
        setState((prev) => {
            const weekStart = getWeekStartFromOffset(prev.weekOffset);
            upsertSlot(
                weekStart,
                date,
                mealType,
                selected.map((r, i) => ({
                    recipeId:   r.isCustom ? null : r.id,
                    recipeName: r.name,
                    isCustom:   r.isCustom ?? false,
                    order:      i,
                }))
            ).catch(console.error);

            return {
                ...prev,
                isDirty: true,
                weekPlan: {
                    ...prev.weekPlan,
                    [date]: {
                        ...prev.weekPlan[date],
                        [mealType]: {
                            id:       prev.weekPlan[date][mealType].id,
                            snapshot: selected.map(r => ({ id: r.id, name: r.name, imageUrl: null, isCustom: r.isCustom })),
                        },
                    },
                },
            };
        });
    }, []);

    const clearSlot = useCallback((date: string, mealType: MealType) => {
        setState((prev) => {
            const weekStart = getWeekStartFromOffset(prev.weekOffset);
            clearSlotAPI(weekStart, date, mealType).catch(console.error);

            return {
                ...prev,
                isDirty: true,
                weekPlan: {
                    ...prev.weekPlan,
                    [date]: {
                        ...prev.weekPlan[date],
                        [mealType]: { id: prev.weekPlan[date][mealType].id, snapshot: null },
                    },
                },
            };
        });
    }, []);


    const setSelectedSlot = useCallback((slot: SelectedSlot | null) => {
        setState((prev) => ({ ...prev, selectedSlot: slot }));
    }, []);

    const setSelectedDay = useCallback((date: string) => {
        setState((prev) => ({ ...prev, selectedDay: date }));
    }, []);

    const setWeekOffset = useCallback(async (offset: number) => {
        const weekStart = getWeekStartFromOffset(offset);
        const apiPlan = await getWeekPlan(weekStart).catch(() => null);
        const weekPlan = apiResponseToWeekPlan(apiPlan, offset);
        setState((prev) => ({
            ...prev,
            weekOffset: offset,
            weekPlan,
            selectedDay: Object.keys(weekPlan)[0],
        }));
    }, []);

    const startMove = useCallback((date: string, mealType: MealType, indexes: number[]) => {
        setState((prev) => ({ ...prev, moveSource: { date, mealType, indexes } }));
    }, []);

    const cancelMove = useCallback(() => {
        setState((prev) => ({ ...prev, moveSource: null }));
    }, []);

    const confirmMove = useCallback((targetDate: string, targetMealType: MealType, copy: boolean) => {
        setState((prev) => {
            if (!prev.moveSource) return prev;
            const { date: srcDate, mealType: srcMeal, indexes } = prev.moveSource;
            if (!prev.weekPlan[targetDate]) return { ...prev, moveSource: null }; // destino fuera de la semana cargada
            if (srcDate === targetDate && srcMeal === targetMealType) return { ...prev, moveSource: null };

            const srcSnapshot = prev.weekPlan[srcDate][srcMeal].snapshot ?? [];
            const movingItems = indexes.map(i => srcSnapshot[i]).filter(Boolean);
            if (movingItems.length === 0) return { ...prev, moveSource: null };

            const dstSnapshot = prev.weekPlan[targetDate][targetMealType].snapshot ?? [];
            const freeSlots = 3 - dstSnapshot.length;
            if (freeSlots <= 0) return { ...prev, moveSource: null };
            const itemsToAdd = movingItems.slice(0, freeSlots);
            const movedIndexes = new Set(indexes.slice(0, itemsToAdd.length));

            const newDstSnapshot = [...dstSnapshot, ...itemsToAdd];
            const newSrcSnapshot = copy ? srcSnapshot : srcSnapshot.filter((_, i) => !movedIndexes.has(i));

            const weekStart = getWeekStartFromOffset(prev.weekOffset);
            upsertSlot(weekStart, targetDate, targetMealType, snapshotToEntries(newDstSnapshot)).catch(console.error);
            if (!copy) {
                upsertSlot(weekStart, srcDate, srcMeal, snapshotToEntries(newSrcSnapshot)).catch(console.error);
            }

            return {
                ...prev,
                isDirty: true,
                moveSource: null,
                weekPlan: {
                    ...prev.weekPlan,
                    [srcDate]: {
                        ...prev.weekPlan[srcDate],
                        [srcMeal]: { ...prev.weekPlan[srcDate][srcMeal], snapshot: newSrcSnapshot.length ? newSrcSnapshot : null },
                    },
                    [targetDate]: {
                        ...prev.weekPlan[targetDate],
                        [targetMealType]: { ...prev.weekPlan[targetDate][targetMealType], snapshot: newDstSnapshot },
                    },
                },
            };
        });
    }, []);

    const weekTotals = useMemo(
        () => getWeekTotals(state.weekPlan, recipes),
        [state.weekPlan, recipes]
    );

    const selectedDayTotals = useMemo(
        () => getDayTotals(state.weekPlan[state.selectedDay], recipes),
        [state.weekPlan, state.selectedDay, recipes]
    );

    return {
        ...state,
        days:              Object.keys(state.weekPlan),
        recipes,
        weekTotals,
        selectedDayTotals,
        getDayTotals:      (date: string) => getDayTotals(state.weekPlan[date], recipes),
        assignRecipe,
        clearSlot,
        setSelectedSlot,
        setSelectedDay,
        setWeekOffset,
        startMove,
        cancelMove,
        confirmMove,
    };
}