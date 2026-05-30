import { Recipe } from "../domain/model.types";

const BASE = 'http://localhost:3000/api/recetas';

export async function getRecetas(): Promise<Recipe[]> {
  const res = await fetch(BASE);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al obtener recetas');
  return json.data;
}

export async function createReceta(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al crear receta');
  return json.data;
}

export async function updateReceta(id: string, recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Recipe> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al actualizar receta');
  return json.data;
}

export async function deleteReceta(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al borrar receta');
}