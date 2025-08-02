export enum RecipeType {
  PR = 'PR',  // Primero
  SG = 'SG',  // Segundo
  AC = 'AC',  // Acompañamiento
  PU = 'PU',  // Plato único
  CN = 'CN',  // Cena
  DS = 'DS',  // Dulce postre
  SN = 'SN',  // Snack/salsa/otro
}

export enum Season {
  invierno = 'invierno',
  primavera = 'primavera',
  verano = 'verano',
  otoño = 'otoño',
}

export enum Context {
  comida = 'comida',
  cena = 'cena',
}

export interface Recipe {
  id: string
  name: string
  type?: RecipeType | null
  context: RecipeContext[]
  ingredients: string
  recipe: string
  notes?: string | null
  season?: Season | null
  createdAt: Date
  robot: boolean
  updatedAt: Date
  proteinas?: number | null
  grasas?: number | null
  carbohidratos?: number | null
  calorias?: number | null
  frequency?: number | null // 1-5 or null
}

export interface RecipeContext {
  id: string
  context: Context
  recipeId: string
  recipe: Recipe
}
