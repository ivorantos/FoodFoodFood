import { Recipe } from "./domain/model.types"; // Asegúrate de tener estos tipos definidos

export const getEmptyRecipe = (): Recipe => ({
  id: crypto.randomUUID(),
  name: "",
  type: null,
  context: [],
  ingredients: "",
  recipe: "",
  notes: "",
  season: null,
  proteinas: null,
  grasas: null,
  carbohidratos: null,
  calorias: null,
  frequency: null,
  robot: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});