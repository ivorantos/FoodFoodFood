import { Recipe } from "../types";

export async function getRecetas(): Promise<Recipe[]> {
  const res = await fetch('http://localhost:3000/api/recetas');

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || 'Error al obtener recetas');
  }

  return json.data; // ← Asegúrate de que el backend devuelve { data: [...] }
}