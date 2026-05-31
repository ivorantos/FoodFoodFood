import { Request, Response } from 'express';
import { clearSlotInDB, deleteWeekPlanFromDB, getWeekPlanFromDB, upsertWeekPlanInDB } from '../repositories/plannerRepository';
import { errorResponse, successResponse } from '../../helpers/response';

export const getWeekPlan = async (req: Request, res: Response) => {
    try {
        const plan = await getWeekPlanFromDB(req.params.weekStart);
        res.json(successResponse(plan));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching week plan'));
    }
};

export const saveWeekPlan = async (req: Request, res: Response) => {
    try {
        const { weekStart, slots } = req.body;
        const plan = await upsertWeekPlanInDB(weekStart, slots);
        res.json(successResponse(plan));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error saving week plan'));
    }
};

export const clearSlot = async (req: Request, res: Response) => {
    try {
        const { weekStart, date, mealType } = req.body;
        await clearSlotInDB(weekStart, date, mealType);
        res.json(successResponse(null));
    } catch (error) {
        res.status(500).json(errorResponse('Error clearing slot'));
    }
};

export const deleteWeekPlan = async (req: Request, res: Response) => {
    try {
        await deleteWeekPlanFromDB(req.params.weekStart);
        res.json(successResponse(null));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting week plan'));
    }
};