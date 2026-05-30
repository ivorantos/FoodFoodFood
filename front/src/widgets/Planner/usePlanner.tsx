import { useState, useCallback, useMemo } from 'react';
import type {MealType, Recipe, SelectedSlot, WeekPlan} from '../../domain/model.types';
import {buildEmptyWeek, getDayTotals, getWeekTotals, MOCK_RECIPES} from "./plannerHelper";

interface PlannerState {
    weekOffset:   number;
    weekPlan:     WeekPlan;
    selectedSlot: SelectedSlot | null;
    selectedDay:  string;
    isDirty:      boolean;
}

export function usePlanner() {
    const [state, setState] = useState<PlannerState>(() => {
        const weekPlan = buildEmptyWeek(0);
        return {
            weekOffset:   0,
            weekPlan,
            selectedSlot: null,
            selectedDay:  Object.keys(weekPlan)[0],
            isDirty:      false,
        };
    });

    // TODO: reemplazar MOCK_RECIPES por fetch a la API
    const recipes = MOCK_RECIPES;

    const assignRecipe = useCallback((date: string, mealType: MealType, recipe: Recipe) => {
        setState((prev) => ({
            ...prev,
            isDirty: true,
            weekPlan: {
                ...prev.weekPlan,
                [date]: {
                    ...prev.weekPlan[date],
                    [mealType]: {
                        id: prev.weekPlan[date][mealType].id,
                        snapshot: { id: recipe.id, name: recipe.name, imageUrl: null },
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

    const weekTotals      = useMemo(() => getWeekTotals(state.weekPlan, recipes), [state.weekPlan]);
    const selectedDayTotals = useMemo(
        () => getDayTotals(state.weekPlan[state.selectedDay], recipes),
        [state.weekPlan, state.selectedDay]
    );

    return {
        ...state,
        days:              Object.keys(state.weekPlan),
        weekTotals,
        selectedDayTotals,
        getDayTotals:      (date: string) => getDayTotals(state.weekPlan[date], recipes),
        assignRecipe,
        clearSlot,
        setSelectedSlot,
        setSelectedDay,
        setWeekOffset,
    };
}