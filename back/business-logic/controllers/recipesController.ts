// server/business-logic/controllers/recetas.controller.ts
import { Request, Response } from 'express';
import { getRecetasFromDB } from '../repositories/recipesRepository';

export function getAllRecetas(req: Request, res: Response) {
  const recetas = getRecetasFromDB();
  res.json(recetas);
}
