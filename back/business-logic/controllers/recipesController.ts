// server/business-logic/controllers/recetas.controller.ts
import { Request, Response } from 'express';
import { createRecetaInDB, deleteRecetaFromDB, getRecetasFromDB, updateRecetaInDB } from '../repositories/recipesRepository';
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

export const createReceta = async (req: Request, res: Response) => {
  try {
    /*todo bring back the context*/
    const { context, ...data}= req.body
    const receta = await createRecetaInDB(data);
    res.status(201).json(successResponse(receta));
  } catch (error) {
    console.error("MIRA AQUÍ EL ERROR DE LA DB ->", error);
    res.status(500).json(errorResponse('Error creating recipe'));
  }
};

export const updateReceta = async (req: Request, res: Response) => {
  try {
    const receta = await updateRecetaInDB(req.params.id, req.body);
    res.json(successResponse(receta));
  } catch (error) {
    console.error("MIRA AQUÍ EL ERROR DE LA DB ->", error);

    res.status(500).json(errorResponse('Error updating recipe'));
  }
};

export const deleteReceta = async (req: Request, res: Response) => {
  try {
    await deleteRecetaFromDB(req.params.id);
    res.json(successResponse(null));
  } catch (error) {
    res.status(500).json(errorResponse('Error deleting recipe'));
  }
};
