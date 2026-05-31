import { useState, useCallback, useMemo, useEffect } from 'react';
import type { MealType, Recipe, SelectedSlot, WeekPlan } from '../../domain/model.types';
import { buildEmptyWeek, getDayTotals, getWeekTotals } from './plannerHelper';
import { getRecetas } from '../../api/recipeService';

interface PlannerState {
    weekOffset:   number;
    weekPlan:     WeekPlan;
    selectedSlot: SelectedSlot | null;
    swapSource:   SelectedSlot | null;
    selectedDay:  string;
    isDirty:      boolean;
}

export function usePlanner() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);


    useEffect(() => {
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
            swapSource:   null,
            selectedDay:  Object.keys(weekPlan)[0],
            isDirty:      false,
        };
    });

    // Reemplaza el slot completo con el array de recetas seleccionadas
    const assignRecipe = useCallback((date: string, mealType: MealType, selected: Recipe[]) => {
        setState((prev) => ({
            ...prev,
            isDirty: true,
            weekPlan: {
                ...prev.weekPlan,
                [date]: {
                    ...prev.weekPlan[date],
                    [mealType]: {
                        id: prev.weekPlan[date][mealType].id,
                        snapshot: selected.map(r => ({ id: r.id, name: r.name, imageUrl: null })),
                    },
                },
            },
        }));
    }, []);

    const clearSlot = useCallback((date: string, mealType: MealType) => {
        setState((prev) => ({
            ...prev,
            isDirty: true,
            weekPlan: {
                ...prev.weekPlan,
                [date]: {
                    ...prev.weekPlan[date],
                    [mealType]: { id: prev.weekPlan[date][mealType].id, snapshot: null },
                },
            },
        }));
    }, []);

    const setSelectedSlot = useCallback((slot: SelectedSlot | null) => {
        setState((prev) => ({ ...prev, selectedSlot: slot }));
    }, []);

    const setSelectedDay = useCallback((date: string) => {
        setState((prev) => ({ ...prev, selectedDay: date }));
    }, []);

    const setWeekOffset = useCallback((offset: number) => {
        const weekPlan = buildEmptyWeek(offset);
        setState((prev) => ({
            ...prev,
            weekOffset: offset,
            weekPlan,
            selectedDay: Object.keys(weekPlan)[0],
        }));
    }, []);

    const startSwap = useCallback((slot: SelectedSlot) => {
        setState((prev) => ({ ...prev, swapSource: slot }));
    }, []);

    const cancelSwap = useCallback(() => {
        setState((prev) => ({ ...prev, swapSource: null }));
    }, []);

    const confirmSwap = useCallback((targetDate: string, targetMealType: MealType) => {
        setState((prev) => {
            if (!prev.swapSource) return prev;
            const { date: srcDate, mealType: srcMeal } = prev.swapSource;
            const srcSnapshot = prev.weekPlan[srcDate][srcMeal].snapshot;
            const dstSnapshot = prev.weekPlan[targetDate][targetMealType].snapshot;
            return {
                ...prev,
                isDirty: true,
                swapSource: null,
                weekPlan: {
                    ...prev.weekPlan,
                    [srcDate]: {
                        ...prev.weekPlan[srcDate],
                        [srcMeal]: { ...prev.weekPlan[srcDate][srcMeal], snapshot: dstSnapshot },
                    },
                    [targetDate]: {
                        ...prev.weekPlan[targetDate],
                        [targetMealType]: { ...prev.weekPlan[targetDate][targetMealType], snapshot: srcSnapshot },
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
        startSwap,
        cancelSwap,
        confirmSwap,
    };
}