import prisma from "../../db/db";

export async function getWeekPlanFromDB(weekStart: string) {
    return prisma.weekPlan.findUnique({
        where: { weekStart },
        include: { slots: { include: { entries: { orderBy: { order: 'asc' } } } } },
    });
}

export async function clearSlotInDB(weekStart: string, date: string, mealType: 'lunch' | 'dinner') {
    const plan = await prisma.weekPlan.findUnique({ where: { weekStart } });
    if (!plan) return;
    const slot = await prisma.mealSlot.findUnique({
        where: { weekPlanId_date_mealType: { weekPlanId: plan.id, date, mealType } },
    });
    if (!slot) return;
    return prisma.slotEntry.deleteMany({ where: { slotId: slot.id } });
}

export async function deleteWeekPlanFromDB(weekStart: string) {
    return prisma.weekPlan.delete({ where: { weekStart } });
}

export async function upsertSlotInDB(
    weekStart: string,
    date: string,
    mealType: 'lunch' | 'dinner',
    entries: { recipeId?: string | null; recipeName: string; isCustom?: boolean; order: number }[]
) {
    return prisma.$transaction(async (tx) => {
        const plan = await tx.weekPlan.upsert({
            where:  { weekStart },
            create: { weekStart },
            update: { updatedAt: new Date() },
        });

        const slot = await tx.mealSlot.upsert({
            where:  { weekPlanId_date_mealType: { weekPlanId: plan.id, date, mealType } },
            create: { weekPlanId: plan.id, date, mealType },
            update: {},
        });

        await tx.slotEntry.deleteMany({ where: { slotId: slot.id } });

        if (entries.length > 0) {
            await tx.slotEntry.createMany({
                data: entries.map(e => ({
                    slotId:     slot.id,
                    recipeId:   e.isCustom ? null : e.recipeId,
                    recipeName: e.recipeName,
                    isCustom:   e.isCustom ?? false,
                    order:      e.order,
                })),
            });
        }
    });
}

export async function upsertWeekPlanInDB(weekStart: string, slots: {
    date: string;
    mealType: 'lunch' | 'dinner';
    entries: { recipeId?: string | null; recipeName: string; isCustom?: boolean; order: number }[];
}[]) {
    return prisma.$transaction(async (tx) => {
        const plan = await tx.weekPlan.upsert({
            where:  { weekStart },
            create: { weekStart },
            update: { updatedAt: new Date() },
        });

        for (const slot of slots) {
            const existing = await tx.mealSlot.upsert({
                where:  { weekPlanId_date_mealType: { weekPlanId: plan.id, date: slot.date, mealType: slot.mealType } },
                create: { weekPlanId: plan.id, date: slot.date, mealType: slot.mealType },
                update: {},
            });

            await tx.slotEntry.deleteMany({ where: { slotId: existing.id } });

            if (slot.entries.length > 0) {
                await tx.slotEntry.createMany({
                    data: slot.entries.map(e => ({
                        slotId:     existing.id,
                        recipeId:   e.isCustom ? null : e.recipeId,
                        recipeName: e.recipeName,
                        isCustom:   e.isCustom ?? false,
                        order:      e.order,
                    })),
                });
            }
        }

        return getWeekPlanFromDB(weekStart);
    });
}