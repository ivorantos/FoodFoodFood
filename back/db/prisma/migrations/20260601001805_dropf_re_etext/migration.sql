/*
  Warnings:

  - You are about to drop the column `freeText` on the `MealSlot` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekPlanId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    CONSTRAINT "MealSlot_weekPlanId_fkey" FOREIGN KEY ("weekPlanId") REFERENCES "WeekPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealSlot" ("date", "id", "mealType", "weekPlanId") SELECT "date", "id", "mealType", "weekPlanId" FROM "MealSlot";
DROP TABLE "MealSlot";
ALTER TABLE "new_MealSlot" RENAME TO "MealSlot";
CREATE UNIQUE INDEX "MealSlot_weekPlanId_date_mealType_key" ON "MealSlot"("weekPlanId", "date", "mealType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
