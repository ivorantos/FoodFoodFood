import type {WeekPlan, MealType, RecipeSlot} from '../../domain/model.types';
import {Plus} from "lucide-react";

const MEAL_TYPES: MealType[] = ['lunch', 'dinner'];
const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TODAY = new Date().toISOString().slice(0, 10);

const SlotCard = ({ slot, mealType, onAdd, onClear }: {
    slot: RecipeSlot;
    mealType: MealType;
    onAdd: () => void;
    onClear: () => void;
}) => {
    const label = mealType === 'lunch' ? 'Comida' : 'Cena';
    if (!slot.snapshot) return (
        <div onClick={onAdd} className="group flex flex-col items-center justify-center gap-1 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 cursor-pointer transition-colors">
            <Plus size={18} className="text-gray-400 group-hover:text-indigo-400" />
            <span className="text-xs text-gray-400 group-hover:text-indigo-400">{label}</span>
        </div>
    );
    return (
        <div onClick={onClear} className="relative h-24 rounded-xl overflow-hidden cursor-pointer group bg-gray-700">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-xs font-medium text-white leading-tight line-clamp-2">{slot.snapshot.name}</p>
                <span className="text-[10px] text-gray-300">{label}</span>
            </div>
        </div>
    );
};

interface PlannerGridProps {
    weekPlan:    WeekPlan;
    onSlotAdd:   (date: string, meal: MealType) => void;
    onSlotClear: (date: string, meal: MealType) => void;
}

export const PlannerGrid: React.FC<PlannerGridProps> = ({ weekPlan, onSlotAdd, onSlotClear }) => {
    const dates = Object.keys(weekPlan);

    return (
        <div className="overflow-x-auto">
            {/* grid: mínimo 700px para legibilidad, scroll en mobile */}
            <div className="grid min-w-[700px]" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {dates.map((date, i) => {
                    const isToday = date === TODAY;
                    const dayNum  = new Date(date + 'T12:00:00').getDate(); // +T12 evita desfase TZ
                    return (
                        <div key={date} className="flex flex-col gap-2">
                            {/* Cabecera día */}
                            <div className={`rounded-lg py-2 text-center text-sm font-semibold ${
                                isToday
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-300'
                            }`}>
                                <div>{DAY_NAMES[i]}</div>
                                <div className="text-xs font-normal opacity-80">{dayNum}</div>
                            </div>

                            {/* Slots comida + cena */}
                            {MEAL_TYPES.map((meal) => (
                                <SlotCard
                                    key={meal}
                                    slot={weekPlan[date][meal]}
                                    mealType={meal}
                                    onAdd={   () => onSlotAdd(date, meal)}
                                    onClear={ () => onSlotClear(date, meal)}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};