-- CreateTable
CREATE TABLE "WeekPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MealSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekPlanId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    CONSTRAINT "MealSlot_weekPlanId_fkey" FOREIGN KEY ("weekPlanId") REFERENCES "WeekPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SlotEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slotId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "recipeName" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SlotEntry_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MealSlot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SlotEntry_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WeekPlan_weekStart_key" ON "WeekPlan"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "MealSlot_weekPlanId_date_mealType_key" ON "MealSlot"("weekPlanId", "date", "mealType");
