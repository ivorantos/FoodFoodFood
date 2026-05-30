import { Check } from 'lucide-react';
import {MEAL_LABELS, MealType, RECIPES, usePlanner, WEEKLY_PLAN} from "./plannerHelper";

const Planner = () => {
  const { selectedDay, setSelectedDay, mealStatus, toggleMeal, days, weekTotals, selectedDayTotals, getDayTotals } = usePlanner();

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Plan Semanal</h1>
              <div className="text-xl font-semibold text-blue-600">{weekTotals.calories} kcal totales</div>
            </div>
          </div>

          {/* Carrusel días */}
          <div className="flex gap-2 w-full mb-8">
            {days.map((day) => {
              const totals = getDayTotals(day);
              const isSelected = selectedDay === day;
              const isToday = day === 'Miércoles';
              return (
                  <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 cursor-pointer transition-all ${isSelected ? 'transform scale-105' : 'hover:transform hover:scale-102'}`}
                  >
                    <div className={`rounded-lg p-4 h-32 ${isSelected ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'} ${isToday && !isSelected ? 'ring-2 ring-blue-300' : ''}`}>
                      <div className="text-sm font-medium text-center mb-2">{day}</div>
                      <div className="text-xs text-center mb-2">{WEEKLY_PLAN[day].date}</div>
                      <div className="text-sm text-center mb-3 font-semibold">{totals.calories} kcal</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className={`h-2 rounded-full transition-all ${isSelected ? 'bg-white' : 'bg-green-400'}`} style={{ width: `${totals.progress}%` }} />
                      </div>
                      <div className="text-xs text-center">{totals.completedMeals}/{totals.totalMeals} comidas</div>
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Detalle día seleccionado */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedDay}</h2>
                <p className="text-gray-600">{WEEKLY_PLAN[selectedDay].date}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{selectedDayTotals.calories} kcal</div>
              </div>
            </div>

            {/* Macros resumen */}
            <div className="flex gap-3 mb-6">
              <div className="bg-red-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-red-600">{selectedDayTotals.protein}g</div><div className="text-xs text-gray-600">Proteínas</div></div>
              <div className="bg-yellow-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-yellow-600">{selectedDayTotals.carbs}g</div><div className="text-xs text-gray-600">Carbohidratos</div></div>
              <div className="bg-green-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-green-600">{selectedDayTotals.fat}g</div><div className="text-xs text-gray-600">Grasas</div></div>
            </div>

            {/* Comidas del día */}
            {(Object.entries(WEEKLY_PLAN[selectedDay].meals) as [MealType, { recipeId: number; completed: boolean }][]).map(([mealType, meal]) => {
              const recipe = RECIPES[meal.recipeId];
              const isCompleted = mealStatus[selectedDay]?.[mealType]?.completed;
              return (
                  <div key={mealType} className={`rounded-xl p-5 mb-4 border ${mealType === 'comida' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">{MEAL_LABELS[mealType]}</span>
                      <button
                          onClick={() => toggleMeal(selectedDay, mealType)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {isCompleted && <Check className="w-5 h-5 text-white" />}
                      </button>
                    </div>
                    {recipe && (
                        <>
                          <h4 className="text-xl font-semibold text-gray-800 mb-2">{recipe.title}</h4>
                          <ul className="text-sm text-gray-600 bg-white bg-opacity-60 rounded-lg p-3 space-y-1 mb-4">
                            {recipe.ingredients.map((ing, i) => <li key={i}>• {ing}</li>)}
                          </ul>
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <div className="bg-red-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-red-600">{recipe.macros.protein}g</div><div className="text-xs text-gray-600">Proteínas</div></div>
                            <div className="bg-yellow-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-yellow-600">{recipe.macros.carbs}g</div><div className="text-xs text-gray-600">Carbohidratos</div></div>
                            <div className="bg-green-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-green-600">{recipe.macros.fat}g</div><div className="text-xs text-gray-600">Grasas</div></div>
                            <div className="bg-blue-50 rounded-lg p-2 text-center flex-1"><div className="text-sm font-bold text-blue-600">{recipe.calories}</div><div className="text-xs text-gray-600">kcal</div></div>
                          </div>
                        </>
                    )}
                  </div>
              );
            })}
          </div>

        </div>
      </div>
  );
};

export default Planner;