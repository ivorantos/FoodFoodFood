import { useState, useEffect } from 'react';
import { Recipe } from '../../types';
import { getRecetas, createReceta, updateReceta, deleteReceta } from '../../services/recipeService';

export const useRecipes = () => {
  const [recetas, setRecetas] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecetas()
      .then((data) => {
        setRecetas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar recetas');
        setLoading(false);
      });
  }, []);

  return { recetas, loading, error };
};
