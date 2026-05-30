import { usePlanner } from './usePlanner';
import { DAYS_ES } from './plannerHelper';
import type {MealType} from '../../domain/model.types';
import {ChevronLeft, ChevronRight, Eye, RefreshCw, Trash2} from "lucide-react";
import {useState} from "react";
import RecipeDetailModal from '../../components/RecipeDetailModal';

const MEAL_LABEL: Record<MealType, string> = { lunch: 'Comida', dinner: 'Cena' };

const Planner = () => {
  const {
    days, selectedDay, setSelectedDay,
    weekPlan, selectedDayTotals,
    getDayTotals, clearSlot, weekOffset, setWeekOffset,
    recipes,
  } = usePlanner();

  const [viewingRecipeId, setViewingRecipeId] = useState<string | null>(null);
  const [hoveredLunch, setHoveredLunch]   = useState(false);
  const [hoveredDinner, setHoveredDinner] = useState(false);

  const viewingRecipe = viewingRecipeId ? (recipes[viewingRecipeId] ?? null) : null;
  const dayIndex = (iso: string) => (new Date(iso).getDay() + 6) % 7;

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Plan Semanal</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors"><ChevronLeft size={18} /></button>
              <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">Hoy</button>
              <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Carrusel días */}
          <div className="flex gap-2 w-full mb-8">
            {days.map((iso) => {
              const totals     = getDayTotals(iso);
              const isSelected = selectedDay === iso;
              return (
                  <div key={iso} onClick={() => setSelectedDay(iso)} className={`flex-1 cursor-pointer transition-all ${isSelected ? 'transform scale-105' : ''}`}>
                    <div className={`rounded-lg p-4 h-32 ${isSelected ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                      <div className="text-sm font-medium text-center mb-1">{DAYS_ES[dayIndex(iso)]}</div>
                      <div className="text-xs text-center mb-2 opacity-70">{new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-sm text-center font-semibold">{totals.calorias} kcal</div>
                      <div className="text-xs text-center mt-2 opacity-70">
                        {[weekPlan[iso].lunch, weekPlan[iso].dinner].filter(s => s.snapshot).length}/2 comidas
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Detalle día seleccionado */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{DAYS_ES[dayIndex(selectedDay)]}</h2>
                <p className="text-gray-500 text-sm">{selectedDay}</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{selectedDayTotals.calorias} kcal</div>
            </div>

            {/* Macros */}
            <div className="flex gap-3 mb-6">
              <div className="bg-red-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-red-600">{selectedDayTotals.proteinas}g</div><div className="text-xs text-gray-600">Proteínas</div></div>
              <div className="bg-yellow-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-yellow-600">{selectedDayTotals.carbohidratos}g</div><div className="text-xs text-gray-600">Carbohidratos</div></div>
              <div className="bg-green-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-green-600">{selectedDayTotals.grasas}g</div><div className="text-xs text-gray-600">Grasas</div></div>
            </div>

            {/* Slots */}
            {(['lunch', 'dinner'] as MealType[]).map((mealType) => {
              const slot    = weekPlan[selectedDay][mealType];
              const hovered = mealType === 'lunch' ? hoveredLunch : hoveredDinner;
              const setHovered = mealType === 'lunch' ? setHoveredLunch : setHoveredDinner;
              return (
                  <div
                      key={mealType}
                      className={`relative rounded-xl p-5 mb-4 border ${mealType === 'lunch' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                  >
                    <span className="font-semibold text-gray-700">{MEAL_LABEL[mealType]}</span>
                    {slot.snapshot
                        ? <>
                          <h4 className="text-xl font-semibold text-gray-800 mt-2">{slot.snapshot.name}</h4>
                          {hovered && (
                              <div className="absolute top-3 right-3 flex gap-1">
                                <button onClick={() => setViewingRecipeId(slot.snapshot!.id)} className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-600 shadow-sm" title="Ver"><Eye size={14} /></button>
                                <button onClick={() => { /* TODO: Bloque 5 */ }} className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-600 shadow-sm" title="Cambiar"><RefreshCw size={14} /></button>
                                <button onClick={() => clearSlot(selectedDay, mealType)} className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-500 shadow-sm" title="Borrar"><Trash2 size={14} /></button>
                              </div>
                          )}
                        </>
                        : <p className="text-gray-400 text-sm italic mt-2">Sin asignar</p>
                    }
                  </div>
              );
            })}
          </div>

        </div>

        {viewingRecipe && (
            <RecipeDetailModal
                isOpen={true}
                recipe={viewingRecipe}
                mode="view"
                onClose={() => setViewingRecipeId(null)}
            />
        )}
      </div>
  );
};

export default Planner;