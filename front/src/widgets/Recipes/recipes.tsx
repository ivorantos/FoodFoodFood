import { useState } from 'react';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import RecipeCard from './RecipeCard';
import RecipeDetailModal from '../../components/RecipeDetailModal';
import { useRecipesHelper } from './useRecipes';

const Recipes = () => {
  const {
    filteredRecipes, filters, seasons, types,
    loading, error,
    selectedRecipe, modalMode,
    handleFilterChange, clearFilters,
    openRecipe, openCreateModal, closeModal,
    handleSave, handleDelete,
  } = useRecipesHelper();

  const [showFilters, setShowFilters] = useState(false);

  if (loading) return <p style={{ padding: 16, color: '#aaa' }}>Cargando recetas...</p>;
  if (error) return <p style={{ padding: 16, color: '#f87171' }}>Error: {error}</p>;

  return (
      <div style={{ minHeight: '100vh', background: '#111', padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>Mis Recetas</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowFilters(v => !v)} style={iconBtnStyle}>
              <SlidersHorizontal size={17} />
            </button>
            <button onClick={openCreateModal} style={{ ...iconBtnStyle, background: '#FF9500', border: '1px solid #FF9500', color: '#fff' }}>
              <Plus size={17} />
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <input
              type="text"
              placeholder="Título, ingrediente, notas..."
              value={filters.tags}
              onChange={e => handleFilterChange('tags', e.target.value)}
              style={searchStyle}
          />
        </div>

        {/* Filtros colapsables */}
        {showFilters && (
            <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <select value={filters.season} onChange={e => handleFilterChange('season', e.target.value)} style={selectStyle}>
                <option value="">Todas las temporadas</option>
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)} style={selectStyle}>
                <option value="">Todos los tipos</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aaa', fontSize: 13 }}>
                <input type="checkbox" checked={filters.robotCooking} onChange={e => handleFilterChange('robotCooking', e.target.checked)} />
                Robot de cocina
              </label>
              <button onClick={clearFilters} style={{ marginLeft: 'auto', color: '#FF9500', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                Limpiar
              </button>
            </div>
        )}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filteredRecipes.length === 0
              ? <p style={{ color: '#555', gridColumn: '1/-1', textAlign: 'center', paddingTop: 60 }}>No hay resultados.</p>
              : filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} onOpen={openRecipe} onDelete={handleDelete} />
              ))
          }
        </div>

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
      </div>
  );
};

const iconBtnStyle: React.CSSProperties = {
  width: 38, height: 38, borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.12)',
  background: '#1a1a1a', color: '#aaa',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

const searchStyle: React.CSSProperties = {
  width: '100%', height: 42, borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#1a1a1a', padding: '0 16px',
  fontSize: 13, color: '#fff', outline: 'none',
};

const selectStyle: React.CSSProperties = {
  background: '#222', border: '1px solid rgba(255,255,255,0.1)',
  color: '#ccc', borderRadius: 8, padding: '6px 10px', fontSize: 13,
};

export default Recipes;