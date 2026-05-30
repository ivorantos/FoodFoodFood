import { Filter, Plus } from 'lucide-react';
import RecipeCard from './RecipeCard';
import RecipeDetailModal from '../../components/RecipeDetailModal';
import {useRecipesHelper} from "./useRecipes";

const Recipes = () => {
  const {
    filteredRecipes, filters, seasons, types,
    loading, error,
    selectedRecipe, modalMode,
    handleFilterChange, clearFilters,
    openRecipe, openCreateModal, closeModal,
    handleSave, handleDelete,
  } = useRecipesHelper();

  if (loading) return <p className="p-4">Cargando recetas...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Cabecera */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mis Recetas</h1>
            <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <Plus className="w-4 h-4" /> Nueva Receta
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">Filtros</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={filters.season} onChange={(e) => handleFilterChange('season', e.target.value)} className="p-2 border rounded">
                <option value="">Todas las temporadas</option>
                {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="p-2 border rounded">
                <option value="">Todos los tipos</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                  type="text"
                  placeholder="Buscar..."
                  value={filters.tags}
                  onChange={(e) => handleFilterChange('tags', e.target.value)}
                  className="p-2 border rounded"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.robotCooking} onChange={(e) => handleFilterChange('robotCooking', e.target.checked)} />
                <span>Robot de cocina</span>
              </label>
            </div>
            <button onClick={clearFilters} className="mt-2 text-blue-500 hover:text-blue-700 text-sm">Limpiar filtros</button>
          </div>

          {/* Grid de recetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length === 0
                ? <p className="text-gray-500 text-center col-span-full">No hay resultados.</p>
                : filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onOpen={openRecipe} onDelete={handleDelete} />
                ))
            }
          </div>

          {/* Modal */}
          {selectedRecipe && (
              <RecipeDetailModal
                  isOpen={true}
                  recipe={selectedRecipe}
                  mode={modalMode}
                  onClose={closeModal}
                  onSave={handleSave}
                  onDelete={handleDelete}
              />
          )}
        </main>
      </div>
  );
};

export default Recipes;