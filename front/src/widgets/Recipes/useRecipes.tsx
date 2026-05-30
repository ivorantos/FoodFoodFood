// widgets/Recipes/Recipes.helper.ts
import { useState, useEffect } from 'react';
import { Recipe, Season, RecipeType } from '../../domain/model.types';
import { getRecetas, createReceta, updateReceta, deleteReceta } from '../../api/recipeService';
import { getEmptyRecipe } from '../../utils';
import {ModalMode} from "../../domain/app.types";


export interface Filters {
  season: string;
  type: string;
  tags: string;
  robotCooking: boolean;
}

const defaultFilters: Filters = { season: '', type: '', tags: '', robotCooking: false };

export const useRecipesHelper = () => {
  const [recetas, setRecetas] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('view');

  const seasons = Object.values(Season);
  const types = Object.values(RecipeType);

  useEffect(() => {
    getRecetas()
        .then((data) => { setRecetas(data); setLoading(false); })
        .catch((err) => { setError(err.message || 'Error al cargar recetas'); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!recetas.length) { setFilteredRecipes([]); return; }
    const tag = filters.tags.toLowerCase();
    const filtered = recetas.filter((r) => {
      if (filters.season && r.season !== filters.season) return false;
      if (filters.type && r.type !== filters.type) return false;
      if (filters.robotCooking && !r.robot) return false;
      if (tag && ![r.name, r.notes, r.ingredients, r.type].some(f => f?.toLowerCase().includes(tag))) return false;
      return true;
    });
    setFilteredRecipes(filtered);
  }, [filters, recetas]);

  const handleFilterChange = (key: keyof Filters, value: any) =>
      setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(defaultFilters);

  const openRecipe = (recipe: Recipe, mode: ModalMode) => {
    setSelectedRecipe(recipe);
    setModalMode(mode);
  };

  const openCreateModal = () => {
    setSelectedRecipe(getEmptyRecipe());
    setModalMode('create');
  };

  const closeModal = () => setSelectedRecipe(null);

  const handleSave = async (recipe: Recipe, isNew: boolean) => {
    const { id, createdAt, updatedAt, ...rest } = recipe;
    if (isNew) {
      const created = await createReceta(rest);
      setRecetas((prev) => [created, ...prev]);
    } else {
      const updated = await updateReceta(id, rest);
      setRecetas((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteReceta(id);
    setRecetas((prev) => prev.filter((r) => r.id !== id));
    closeModal();
  };

  return {
    filteredRecipes, filters, seasons, types,
    loading, error,
    selectedRecipe, modalMode,
    handleFilterChange, clearFilters,
    openRecipe, openCreateModal, closeModal,
    handleSave, handleDelete,
  };
};