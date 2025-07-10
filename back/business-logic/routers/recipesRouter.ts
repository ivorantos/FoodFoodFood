// server/business-logic/routers/recetas.router.ts
import { Router } from 'express';
import { getAllRecetas } from '../controllers/recipesController';


const router = Router();

router.get('/', getAllRecetas);

export default router;
