// RecipeDetailModal.tsx
import React from 'react';
import { X, Flame, Clock, Leaf } from 'lucide-react';
import { Recipe, RecipeType, Season } from '../types';

type Props = {
  recipe: Recipe;
  onClose: () => void;
};

const RecipeDetailModal = ({ recipe, onClose }: Props) => {
  if (!recipe) return null;

  const getTypeColor = (type: string) => {
    const colors = {
      PR: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      SG: 'bg-blue-100 text-blue-800 border-blue-200',
      AC: 'bg-purple-100 text-purple-800 border-purple-200',
      PU: 'bg-orange-100 text-orange-800 border-orange-200',
      CN: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      DS: 'bg-pink-100 text-pink-800 border-pink-200',
      SN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const MacroCard = ({ icon, label, value, unit, color }) => (
    <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/80`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">
        {value || '—'}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose} // Cierra si clicas fuera
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()} // Evita que clics dentro del modal lo cierren
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{recipe.name}</h2>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Tipo */}
                {recipe.type && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                      recipe.type
                    )} bg-white/90`}
                  >
                    {RecipeType[recipe.type] || recipe.type}
                  </span>
                )}

                {/* Estación */}
                {recipe.season && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {Season[recipe.season] || recipe.season}
                  </span>
                )}

                {/* Contexto (si hay) o placeholder */}
                {recipe.context?.length ? (
                  recipe.context.map((ctx, idx) => (
                    <span
                      key={idx}
                      className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {ctx.context || "Sin definir"}
                    </span>
                  ))
                ) : (
                  <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm font-medium italic">
                    Sin contexto
                  </span>
                )}
              </div>
            </div>

            {/* Frecuencia (siempre visible) */}
            <div className="text-right">
              <div className="text-sm opacity-80">Frecuencia</div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < (recipe.frequency ?? 0) ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
              {!recipe.frequency && (
                <div className="text-xs text-white/70 italic mt-1">
                  No definida
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {(recipe.calorias ||
            recipe.proteinas ||
            recipe.carbohidratos ||
            recipe.grasas) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Información Nutricional
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MacroCard
                  icon={<Flame size={16} className="text-orange-600" />}
                  label="Calorías"
                  value={recipe.calorias}
                  unit="kcal"
                  color="bg-orange-100"
                />
                <MacroCard
                  icon={<div className="w-4 h-4 bg-blue-600 rounded-full" />}
                  label="Proteínas"
                  value={recipe.proteinas}
                  unit="g"
                  color="bg-blue-100"
                />
                <MacroCard
                  icon={<div className="w-4 h-4 bg-green-600 rounded-full" />}
                  label="Carbohidratos"
                  value={recipe.carbohidratos}
                  unit="g"
                  color="bg-green-100"
                />
                <MacroCard
                  icon={<div className="w-4 h-4 bg-yellow-600 rounded-full" />}
                  label="Grasas"
                  value={recipe.grasas}
                  unit="g"
                  color="bg-yellow-100"
                />
              </div>
            </div>
          )}

          {/* Ingredientes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Ingredientes
            </h3>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-gray-700 leading-relaxed">
                {recipe.ingredients}
              </p>
            </div>
          </div>

          {/* Preparación */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Preparación
            </h3>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recipe.recipe}
              </p>
            </div>
          </div>

          {/* Notas */}
          {recipe.notes && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💡 Notas
              </h3>
              <div className="bg-amber-50/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
                <p className="text-amber-800 leading-relaxed">{recipe.notes}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200/50">
            <span>ID: {recipe.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
