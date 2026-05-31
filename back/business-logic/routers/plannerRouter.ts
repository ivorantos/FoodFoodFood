import { Router } from 'express';
import { clearSlot, deleteWeekPlan, getWeekPlan, saveWeekPlan } from '../controllers/plannerController';

const router = Router();

router.get('/:weekStart', getWeekPlan);
router.post('/', saveWeekPlan);
router.patch('/slot/clear', clearSlot);
router.delete('/:weekStart', deleteWeekPlan);

export default router;