// server/business-logic/routers/recetas.router.ts
import { Router } from 'express';
import { createReceta, deleteReceta, getAllRecetas, updateReceta } from '../controllers/recipesController';


const router = Router();

router.get('/', getAllRecetas);
router.post('/', createReceta);
router.put('/:id', updateReceta);
router.delete('/:id', deleteReceta);

export default router;