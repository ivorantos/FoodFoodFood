import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit2, Trash2, Upload, ChefHat } from 'lucide-react';



const Recipes = () => {

    const sampleRecipes = [
    {
      id: 1,
      title: "Paella Valenciana",
      ingredients: ["arroz", "pollo", "judías verdes", "garrofón", "tomate", "azafrán"],
      type: "plato único",
      season: "primavera",
      tags: ["tradicional", "robot de cocina"],
      robotCooking: true,
      description: "Auténtica paella valenciana con pollo y verduras"
    },
    {
      id: 2,
      title: "Gazpacho Andaluz",
      ingredients: ["tomate", "pepino", "pimiento", "cebolla", "ajo", "aceite de oliva"],
      type: "primero",
      season: "verano",
      tags: ["vegetariano", "fresco"],
      robotCooking: false,
      description: "Refrescante gazpacho perfecto para el verano"
    },
    {
      id: 3,
      title: "Lentejas Estofadas",
      ingredients: ["lentejas", "chorizo", "morcilla", "zanahoria", "cebolla", "laurel"],
      type: "guiso",
      season: "invierno",
      tags: ["tradicional", "robot de cocina"],
      robotCooking: true,
      description: "Lentejas tradicionales con chorizo y morcilla"
    },
    {
      id: 4,
      title: "Ensalada César",
      ingredients: ["lechuga romana", "pollo", "parmesano", "picatostes", "anchoas"],
      type: "cena",
      season: "todo el año",
      tags: ["ensalada", "ligero"],
      robotCooking: false,
      description: "Clásica ensalada César con pollo a la plancha"
    },
    {
      id: 5,
      title: "Crema de Calabaza",
      ingredients: ["calabaza", "cebolla", "zanahoria", "nata", "jengibre"],
      type: "primero",
      season: "otoño",
      tags: ["vegetariano", "robot de cocina", "cremoso"],
      robotCooking: true,
      description: "Suave crema de calabaza con un toque de jengibre"
    }
  ];

  const [recipes, setRecipes] = useState(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);
  const [filters, setFilters] = useState({
    season: '',
    type: '',
    tags: '',
    robotCooking: false
  });
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const meals = ['Comida', 'Cena'];
  const seasons = ['primavera', 'verano', 'otoño', 'invierno', 'todo el año'];
  const types = ['plato único', 'primero', 'guiso', 'cena', 'guarnición'];

  // Aplicar filtros
  useEffect(() => {
    const filtered = recipes.filter(recipe => {
      if (filters.season && recipe.season !== filters.season) return false;
      if (filters.type && recipe.type !== filters.type) return false;
      if (filters.tags && !recipe.tags.some(tag => tag.toLowerCase().includes(filters.tags.toLowerCase()))) return false;
      if (filters.robotCooking && !recipe.robotCooking) return false;
      return true;
    });
    setFilteredRecipes(filtered);
  }, [filters, recipes]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
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

  const addToMenu = (recipeId, day, meal) => {
    const key = `${day}-${meal}`;
    setWeeklyMenu(prev => ({
      ...prev,
      [key]: recipeId
    }));
  };


  const handleSaveRecipe = (recipeData) => {
    if (editingRecipe) {
      setRecipes(prev => prev.map(recipe => 
        recipe.id === editingRecipe.id ? { ...recipeData, id: editingRecipe.id } : recipe
      ));
    } else {
      const newRecipe = {
        ...recipeData,
        id: Math.max(...recipes.map(r => r.id)) + 1
      };
      setRecipes(prev => [...prev, newRecipe]);
    }
    setShowRecipeForm(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    // Limpiar del menú si está asignada
    const newMenu = { ...weeklyMenu };
    Object.keys(newMenu).forEach(key => {
      if (newMenu[key] === id) {
        delete newMenu[key];
      }
    });
    setWeeklyMenu(newMenu);
  };

  const exportToPDF = () => {
    let pdfContent = "MENÚ SEMANAL\n\n";
    days.forEach(day => {
      pdfContent += `${day.toUpperCase()}\n`;
      meals.forEach(meal => {
        const recipeId = weeklyMenu[`${day}-${meal}`];
        const recipe = recipes.find(r => r.id === recipeId);
        pdfContent += `  ${meal}: ${recipe ? recipe.title : 'Sin asignar'}\n`;
      });
      pdfContent += "\n";
    });
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-semanal.txt';
    a.click();
  };

  const importRecipes = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedRecipes = JSON.parse(e.target.result.toString());
          const recipesWithIds = importedRecipes.map(recipe => ({
            ...recipe,
            id: Math.max(...recipes.map(r => r.id), 0) + recipes.length + Math.random()
          }));
          setRecipes(prev => [...prev, ...recipesWithIds]);
        } catch (error) {
          alert('Error al importar recetas. Verifica el formato JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const RecipeCard = ({ recipe }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{recipe.title}</h3>
        <div className="flex gap-1">
          {recipe.robotCooking && <ChefHat className="w-4 h-4 text-blue-500" />}
          <button onClick={() => { setEditingRecipe(recipe); setShowRecipeForm(true); }} className="text-blue-500 hover:text-blue-700">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteRecipe(recipe.id)} className="text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>
      <div className="mb-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{recipe.type}</span>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">{recipe.season}</span>
      </div>
      <div className="mb-2">
        {recipe.tags.map(tag => (
          <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">{tag}</span>
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-3">
        <strong>Ingredientes:</strong> {recipe.ingredients.join(', ')}
      </p>
    </div>
  );

  const RecipeForm = ({ recipe, onSave, onCancel }) => {
    const [formData, setFormData] = useState(recipe || {
      title: '',
      ingredients: [],
      type: '',
      season: '',
      tags: [],
      robotCooking: false,
      description: ''
    });

    const handleSubmit = () => {
      if (formData.title && formData.type && formData.season) {
        onSave(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{recipe ? 'Editar Receta' : 'Nueva Receta'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título de la receta"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded h-20"
            />
            <input
              type="text"
              placeholder="Ingredientes (separados por comas)"
              value={formData.ingredients?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value.split(',').map(i => i.trim()) }))}
              className="w-full p-2 border rounded"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccionar tipo</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select
              value={formData.season}
              onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccionar estación</option>
              {seasons.map(season => <option key={season} value={season}>{season}</option>)}
            </select>
            <input
              type="text"
              placeholder="Etiquetas (separadas por comas)"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
              className="w-full p-2 border rounded"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.robotCooking}
                onChange={(e) => setFormData(prev => ({ ...prev, robotCooking: e.target.checked }))}
              />
              <span>Robot de cocina</span>
            </label>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => {
                  if (formData.title && formData.type && formData.season) {
                    onSave(formData);
                  }
                }}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Guardar
              </button>
              <button type="button" onClick={onCancel} className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 py-6">
        {(
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
                  {seasons.map(season => <option key={season} value={season}>{season}</option>)}
                </select>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">Todos los tipos</option>
                  {types.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Buscar por etiquetas..."
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
              <button onClick={clearFilters} className="mt-2 text-blue-500 hover:text-blue-700 text-sm">
                Limpiar filtros
              </button>
            </div>

            {/* Acciones */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowRecipeForm(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Nueva Receta
              </button>
              <label className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
                <Upload className="w-4 h-4" />
                Importar JSON
                <input type="file" accept=".json" onChange={importRecipes} className="hidden" />
              </label>
            </div>

            {/* Lista de recetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}

      </main>

      {showRecipeForm && (
        <RecipeForm
          recipe={editingRecipe}
          onSave={handleSaveRecipe}
          onCancel={() => {
            setShowRecipeForm(false);
            setEditingRecipe(null);
          }}
        />
      )}
    </div>
  );
};

export default Recipes;