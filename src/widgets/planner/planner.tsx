import React, { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react';

const Planner = () => {
  // Datos mock de recetas
  const sampleRecipes = {
    1: {
      id: 1,
      title: "Paella Valenciana",
      ingredients: ["arroz", "pollo", "judías verdes", "garrofón", "tomate", "azafrán"],
      calories: 450,
      macros: { protein: 25, carbs: 55, fat: 12 }
    },
    2: {
      id: 2,
      title: "Gazpacho Andaluz",
      ingredients: ["tomate", "pepino", "pimiento", "cebolla", "ajo", "aceite"],
      calories: 120,
      macros: { protein: 3, carbs: 8, fat: 9 }
    },
    3: {
      id: 3,
      title: "Tostadas con Aguacate",
      ingredients: ["pan integral", "aguacate", "tomate cherry", "aceite", "sal"],
      calories: 280,
      macros: { protein: 8, carbs: 35, fat: 14 }
    },
    4: {
      id: 4,
      title: "Ensalada César",
      ingredients: ["lechuga", "pollo", "parmesano", "picatostes", "anchoas"],
      calories: 320,
      macros: { protein: 28, carbs: 15, fat: 18 }
    },
    5: {
      id: 5,
      title: "Crema de Calabaza",
      ingredients: ["calabaza", "cebolla", "zanahoria", "nata", "jengibre"],
      calories: 180,
      macros: { protein: 4, carbs: 22, fat: 8 }
    }
  };

  // Planificación semanal mock
  const weeklyPlan = {
    'Lunes': {
      date: '24 Jun',
      meals: {
        comida: { recipeId: 1, completed: true },
        cena: { recipeId: 4, completed: false }
      }
    },
    'Martes': {
      date: '25 Jun',
      meals: {
        comida: { recipeId: 5, completed: false },
        cena: { recipeId: 2, completed: false }
      }
    },
    'Miércoles': {
      date: '26 Jun',
      meals: {
        comida: { recipeId: 1, completed: false },
        cena: { recipeId: 4, completed: false }
      }
    },
    'Jueves': {
      date: '27 Jun',
      meals: {
        comida: { recipeId: 5, completed: false },
        cena: { recipeId: 2, completed: false }
      }
    },
    'Viernes': {
      date: '28 Jun',
      meals: {
        comida: { recipeId: 1, completed: false },
        cena: { recipeId: 4, completed: false }
      }
    },
    'Sábado': {
      date: '29 Jun',
      meals: {
        comida: { recipeId: 1, completed: false },
        cena: { recipeId: 2, completed: false }
      }
    },
    'Domingo': {
      date: '30 Jun',
      meals: {
        comida: { recipeId: 5, completed: false },
        cena: { recipeId: 4, completed: false }
      }
    }
  };

  const [selectedDay, setSelectedDay] = useState('Miércoles');
  const [mealStatus, setMealStatus] = useState(() => {
    const status = {};
    Object.keys(weeklyPlan).forEach(day => {
      status[day] = { ...weeklyPlan[day].meals };
    });
    return status;
  });

  const days = Object.keys(weeklyPlan);
  const mealLabels = {
    comida: 'Comida', 
    cena: 'Cena'
  };

  const mealColors = {
    comida: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    cena: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
  };

  // Calcular totales del día
  const getDayTotals = (day) => {
    const dayPlan = weeklyPlan[day];
    let totalCalories = 0;
    let completedMeals = 0;
    let totalMeals = 0;
    
    Object.entries(dayPlan.meals).forEach(([mealType, meal]: [string, any]) => {
      if (meal.recipeId && sampleRecipes[meal.recipeId]) {
        totalCalories += sampleRecipes[meal.recipeId].calories;
        totalMeals++;
        if (mealStatus[day] && mealStatus[day][mealType] && mealStatus[day][mealType].completed) {
          completedMeals++;
        }
      }
    });
    
    return { 
      calories: totalCalories, 
      progress: totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0,
      completedMeals,
      totalMeals
    };
  };

 const getWeekTotals = () => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  days.forEach(day => {
    const dayPlan = weeklyPlan[day];
    Object.values(dayPlan.meals).forEach((meal: any) => {
      if (meal.recipeId && sampleRecipes[meal.recipeId]) {
        const recipe = sampleRecipes[meal.recipeId];
        totalCalories += recipe.calories;
        totalProtein += recipe.macros.protein;
        totalCarbs += recipe.macros.carbs;
        totalFat += recipe.macros.fat;
      }
    });
  });

  return { totalCalories, totalProtein, totalCarbs, totalFat };
};


const getSelectedDayTotals = () => {
  const dayPlan = weeklyPlan[selectedDay];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  Object.values(dayPlan.meals).forEach((meal: any) => {
    if (meal.recipeId && sampleRecipes[meal.recipeId]) {
      const recipe = sampleRecipes[meal.recipeId];
      totalCalories += recipe.calories;
      totalProtein += recipe.macros.protein;
      totalCarbs += recipe.macros.carbs;
      totalFat += recipe.macros.fat;
    }
  });

  return { totalCalories, totalProtein, totalCarbs, totalFat };
};


  const toggleMealStatus = (day, meal) => {
    setMealStatus(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          completed: !prev[day][meal].completed
        }
      }
    }));
  };

  const weekTotals = getWeekTotals();
  const selectedDayTotals = getSelectedDayTotals();

  return (
    <div className="min-h-screen bg-gray-50">
     
      {/* Main Content */}
      <div className="mx-auto px-4 py-8">
        {/* Título y calorías alineados a la izquierda */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Plan Semanal</h1>
            <div className="text-xl font-semibold text-blue-600">{weekTotals.totalCalories} kcal totales</div>
          </div>
        </div>

        <div className="mb-8">
          {/* Carrusel de días expandido */}
          <div className="flex gap-2 w-full">
            {days.map((day) => {
              const totals = getDayTotals(day);
              const isSelected = selectedDay === day;
              const isToday = day === 'Miércoles';
              
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 cursor-pointer transition-all ${
                    isSelected 
                      ? 'transform scale-105' 
                      : 'hover:transform hover:scale-102'
                  }`}
                >
                  <div className={`rounded-lg p-4 h-32 ${
                    isSelected 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${isToday && !isSelected ? 'ring-2 ring-blue-300' : ''}`}>
                    <div className="text-sm font-medium text-center mb-2">
                      {day}
                    </div>
                    <div className="text-xs text-center mb-2">
                      {weeklyPlan[day].date}
                    </div>
                    <div className="text-sm text-center mb-3 font-semibold">
                      {totals.calories} kcal
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isSelected ? 'bg-white' : 'bg-green-400'
                        }`}
                        style={{ width: `${totals.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-center">
                      {totals.completedMeals}/{totals.totalMeals} comidas
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalle del día seleccionado */}
        <div className="mt-8">
          {/* Card del día */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedDay}</h2>
                <p className="text-gray-600">{weeklyPlan[selectedDay].date}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{selectedDayTotals.totalCalories} kcal</div>
                <div className="text-sm text-gray-600">Total del día</div>
              </div>
            </div>
            
            {/* Macros del día */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-600">{selectedDayTotals.totalProtein}g</div>
                <div className="text-sm text-gray-600">Proteínas</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-yellow-600">{selectedDayTotals.totalCarbs}g</div>
                <div className="text-sm text-gray-600">Carbohidratos</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{selectedDayTotals.totalFat}g</div>
                <div className="text-sm text-gray-600">Grasas</div>
              </div>
            </div>
          </div>

          {/* Cards de comidas - Solo comida y cena más anchas */}
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(weeklyPlan[selectedDay].meals).map(([mealType, meal]: [string, any]) => {
              const recipe = sampleRecipes[meal.recipeId];
              const isCompleted = mealStatus[selectedDay][mealType]?.completed || false;
              
              return (
                <div key={mealType} className={`border rounded-xl p-6 ${mealColors[mealType]} transition-all hover:shadow-md`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{mealLabels[mealType]}</h3>
                    <button
                      onClick={() => toggleMealStatus(selectedDay, mealType)}
                      className={`p-2 rounded-full transition-all ${
                        isCompleted 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-5 h-5"></div>
                      )}
                    </button>
                  </div>
                  
                  {recipe && (
                    <>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{recipe.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Una deliciosa receta tradicional con ingredientes frescos y sabores auténticos.
                      </p>
                      
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</div>
                        <div className="text-sm text-gray-600 bg-white bg-opacity-60 rounded-lg p-3">
                          <ul className="space-y-1">
                            {recipe.ingredients.map((ingredient, index) => (
                              <li key={index}>• {ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <div className="bg-red-50 rounded-lg p-2 text-center flex-1">
                          <div className="text-sm font-bold text-red-600">{recipe.macros.protein}g</div>
                          <div className="text-xs text-gray-600">Proteínas</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2 text-center flex-1">
                          <div className="text-sm font-bold text-yellow-600">{recipe.macros.carbs}g</div>
                          <div className="text-xs text-gray-600">Carbohidratos</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 text-center flex-1">
                          <div className="text-sm font-bold text-green-600">{recipe.macros.fat}g</div>
                          <div className="text-xs text-gray-600">Grasas</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center flex-1">
                          <div className="text-sm font-bold text-blue-600">{recipe.calories}</div>
                          <div className="text-xs text-gray-600">kcal</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;