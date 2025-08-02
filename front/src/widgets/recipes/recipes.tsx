import React, { useEffect, useState } from 'react';
import { Filter, Plus, Edit2, Trash2, Upload, ChefHat } from 'lucide-react';
import { Recipe, Season, RecipeType } from '../../types';
import { useRecipes } from './useRecipes';

const Recipes = () => {
  const { recetas, loading, error } = useRecipes();

  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState({
    season: '',
    type: '',
    tags: '',
    robotCooking: false
  });
  const [weeklyMenu, setWeeklyMenu] = useState<Record<string, string>>({});
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const meals = ['Comida', 'Cena'];
  const seasons = Object.values(Season);
  const types = Object.values(RecipeType);

  useEffect(() => {
    if (!recetas.length) return;
    const filtered = recetas.filter((recipe) => {
      if (filters.season && recipe.season !== filters.season) return false;
      if (filters.type && recipe.type !== filters.type) return false;
      if (
        filters.tags &&
        !recipe.notes?.toLowerCase().includes(filters.tags.toLowerCase())
      )
        return false;
      if (filters.robotCooking && !recipe.robot) return false;
      return true;
    });
    setFilteredRecipes(filtered);
  }, [filters, recetas]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      season: '',
      type: '',
      tags: '',
      robotCooking: false
    });
  };

  const addToMenu = (recipeId: string, day: string, meal: string) => {
    const key = `${day}-${meal}`;
    setWeeklyMenu((prev) => ({
      ...prev,
      [key]: recipeId
    }));
  };

  const handleDeleteRecipe = (id: string) => {
    alert('Implementar eliminación real en la API si es necesario.');
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{recipe.name}</h3>
        <div className="flex gap-1">
          {recipe.robot && <ChefHat className="w-4 h-4 text-blue-500" />}
          <button
            onClick={() => {
              setEditingRecipe(recipe);
              setShowRecipeForm(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteRecipe(recipe.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{recipe.notes}</p>
      <div className="mb-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
          {recipe.type}
        </span>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">
          {recipe.season}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        <strong>Ingredientes:</strong> {recipe.ingredients}
      </p>
    </div>
  );

  if (loading) return <p className="p-4">Cargando recetas...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <>
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <h2 className="font-semibold">Filtros</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.season}
                onChange={(e) => handleFilterChange('season', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Todas las estaciones</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Todos los tipos</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Buscar por notas..."
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                className="p-2 border rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.robotCooking}
                  onChange={(e) => handleFilterChange('robotCooking', e.target.checked)}
                />
                <span>Robot de cocina</span>
              </label>
            </div>
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Lista de recetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      </main>
    </div>
  );
};

export default Recipes;
