import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeftRight, Pencil, Trash2 } from 'lucide-react';

import { DAYS_ES } from './plannerHelper';
import type { MealType, SelectedSlot } from '../../domain/model.types';
import SlotPicker from "./slotPicker";
import {usePlannerContext} from "./plannerContext";

const MEAL_LABEL: Record<MealType, string> = { lunch: 'Comida', dinner: 'Cena' };

const Planner = () => {
  const {
    days, selectedDay, setSelectedDay,
    weekPlan, selectedDayTotals, getDayTotals,
    clearSlot, weekOffset, setWeekOffset,
    assignRecipe, recipes,
    swapSource, startSwap, cancelSwap, confirmSwap,
  } = usePlannerContext();

  const [pickerSlot, setPickerSlot] = useState<SelectedSlot | null>(null);

  // Cancelar swap con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelSwap(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelSwap]);

  const dayIndex = (iso: string) => (new Date(iso).getDay() + 6) % 7;

  const handleSlotClick = (date: string, mealType: MealType) => {
    const slot = weekPlan[date][mealType];
    if (swapSource) {
      // segundo clic en modo swap
      if (swapSource.date === date && swapSource.mealType === mealType) {
        cancelSwap();
      } else {
        confirmSwap(date, mealType);
      }
      return;
    }
    if (!slot.snapshot) {
      setPickerSlot({ date, mealType });
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Plan Semanal</h1>
            {swapSource && (
                <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <ArrowLeftRight size={14} />
                  Elige destino o pulsa Esc para cancelar
                </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 rounded-lg hover:bg-gray-200"><ChevronLeft size={18} /></button>
              <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium">Hoy</button>
              <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 rounded-lg hover:bg-gray-200"><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Carrusel días */}
          <div className="flex gap-2 w-full mb-8">
            {days.map((iso) => {
              const totals     = getDayTotals(iso);
              const isSelected = selectedDay === iso;
              const isSwapSrc  = swapSource?.date === iso;
              return (
                  <div
                      key={iso}
                      onClick={() => setSelectedDay(iso)}
                      className={`flex-1 cursor-pointer transition-all ${isSelected ? 'scale-105' : ''}`}
                  >
                    <div className={`rounded-lg p-4 h-32 border-2 transition-colors ${
                        isSwapSrc  ? 'border-amber-400 bg-amber-50' :
                            isSelected ? 'bg-blue-500 text-white shadow-lg border-transparent' :
                                'bg-white text-gray-700 hover:bg-gray-50 border-transparent'
                    }`}>
                      <div className="text-sm font-medium text-center mb-1">{DAYS_ES[dayIndex(iso)]}</div>
                      <div className="text-xs text-center mb-2 opacity-70">{new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-sm text-center font-semibold">{totals.calorias} kcal</div>
                      <div className="text-xs text-center mt-2 opacity-70">
                        {[weekPlan[iso].lunch, weekPlan[iso].dinner].filter((s) => s.snapshot).length}/2
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Detalle día */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{DAYS_ES[dayIndex(selectedDay)]}</h2>
                <p className="text-gray-500 text-sm">{selectedDay}</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{selectedDayTotals.calorias} kcal</div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="bg-red-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-red-600">{selectedDayTotals.proteinas}g</div><div className="text-xs text-gray-600">Proteínas</div></div>
              <div className="bg-yellow-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-yellow-600">{selectedDayTotals.carbohidratos}g</div><div className="text-xs text-gray-600">Carbohidratos</div></div>
              <div className="bg-green-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-green-600">{selectedDayTotals.grasas}g</div><div className="text-xs text-gray-600">Grasas</div></div>
            </div>

            {(['lunch', 'dinner'] as MealType[]).map((mealType) => {
              const slot      = weekPlan[selectedDay][mealType];
              const isSwapSrc = swapSource?.date === selectedDay && swapSource?.mealType === mealType;
              const isSwapDst = !!swapSource && !(swapSource.date === selectedDay && swapSource.mealType === mealType);

              return (
                  <div
                      key={mealType}
                      onClick={() => handleSlotClick(selectedDay, mealType)}
                      className={`rounded-xl p-5 mb-4 border-2 cursor-pointer transition-all ${
                          isSwapSrc ? 'border-amber-400 bg-amber-50 animate-pulse' :
                              isSwapDst ? 'border-indigo-400 bg-indigo-50' :
                                  mealType === 'lunch'
                                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                                      : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">{MEAL_LABEL[mealType]}</span>
                      {slot.snapshot && !swapSource && (
                          <div className="flex gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); setPickerSlot({ date: selectedDay, mealType }); }}
                                className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Pencil size={12} /> Cambiar
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); startSwap({ date: selectedDay, mealType }); }}
                                className="text-xs text-amber-500 hover:text-amber-700 flex items-center gap-1 ml-2"
                            >
                              <ArrowLeftRight size={12} /> Mover
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); clearSlot(selectedDay, mealType); }}
                                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 ml-2"
                            >
                              <Trash2 size={12} /> Quitar
                            </button>
                          </div>
                      )}
                    </div>
                    {slot.snapshot
                        ? <h4 className="text-xl font-semibold text-gray-800">{slot.snapshot.name}</h4>
                        : <p className="text-gray-400 text-sm italic">
                          {swapSource ? 'Pulsa aquí para mover aquí' : 'Sin asignar — pulsa para añadir'}
                        </p>
                    }
                  </div>
              );
            })}
          </div>
        </div>

        {pickerSlot && (
            <SlotPicker
                recipes={recipes}
                onSelect={(recipe) => {
                  assignRecipe(pickerSlot.date, pickerSlot.mealType, recipe);
                  setPickerSlot(null);
                }}
                onClose={() => setPickerSlot(null)}
            />
        )}
      </div>
  );
};

export default Planner;