import { createContext, useContext, ReactNode } from 'react';
import { usePlanner } from './usePlanner';

type PlannerContextValue = ReturnType<typeof usePlanner>;

const PlannerContext = createContext<PlannerContextValue | null>(null);

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
    const planner = usePlanner();
    return <PlannerContext.Provider value={planner}>{children}</PlannerContext.Provider>;
};

export const usePlannerContext = (): PlannerContextValue => {
    const ctx = useContext(PlannerContext);
    if (!ctx) throw new Error('usePlannerContext must be used inside PlannerProvider');
    return ctx;
};