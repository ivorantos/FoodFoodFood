// server/business-logic/controllers/recetas.controller.ts
import { Request, Response } from 'express';
import { getRecetasFromDB } from '../repositories/recipesRepository';
import { errorResponse, successResponse } from '../../helpers/response';

export const getAllRecetas = async (req : Request, res : Response) => {
  try {
    const recetas = await getRecetasFromDB();
    res.json(successResponse(recetas));

  } catch (error) {
    console.error(error);
   res.status(500).json(errorResponse('Error fetching recipes'));

  }
};
